import fs from 'node:fs';
import path from 'node:path';
import { root } from '../scripts/lib/html.mjs';

const criteriaDir = path.join(root, 'evaluations/criteria');
const resultsDir = path.join(root, 'evaluations/results');

const criteria = fs.readdirSync(criteriaDir)
  .filter((file) => file.endsWith('.json'))
  .flatMap((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(criteriaDir, file), 'utf8'));
    return data.items.map((item) => ({
      ...item,
      scorecard: data.scorecard,
      url: data.url,
    }));
  });

const assertions = new Map();
if (fs.existsSync(resultsDir)) {
  for (const file of fs.readdirSync(resultsDir)) {
    if (!file.endsWith('.json') || file === 'summary.json') continue;
    const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
    for (const item of data.assertions ?? []) {
      const list = assertions.get(item.id) ?? [];
      list.push(item);
      assertions.set(item.id, list);
    }
  }
}

const rows = criteria.map((item) => {
  if (item.status === 'not_applicable') {
    return { ...item, result: 'not_applicable', evidence: item.reason };
  }
  const ids = item.requires ?? [];
  const missing = ids.filter((id) => !assertions.has(id));
  if (missing.length > 0) {
    return { ...item, result: 'fail', evidence: `Missing evidence: ${missing.join(', ')}` };
  }
  const found = ids.flatMap((id) => assertions.get(id));
  const failed = found.filter((entry) => !entry.ok);
  if (failed.length > 0) {
    return { ...item, result: 'fail', evidence: failed.map((entry) => `${entry.id}: ${entry.evidence}`).join(' | ') };
  }
  if (found.every((entry) => String(entry.evidence).startsWith('not_applicable'))) {
    return { ...item, result: 'not_applicable', evidence: found.map((entry) => entry.evidence).join(' | ') };
  }
  return { ...item, result: 'pass', evidence: found.map((entry) => entry.evidence).join(' | ') };
});

const covered = new Set(criteria.flatMap((item) => item.requires ?? []));
const unmapped = [...assertions.values()]
  .flat()
  .filter((entry) => !entry.ok && !covered.has(entry.id));

const ok = rows.every((row) => row.result !== 'fail') && unmapped.length === 0;
const summary = {
  ok,
  pass: rows.filter((row) => row.result === 'pass').length,
  fail: rows.filter((row) => row.result === 'fail').length,
  not_applicable: rows.filter((row) => row.result === 'not_applicable').length,
  unmapped: unmapped.map((entry) => ({ id: entry.id, evidence: entry.evidence })),
  rows,
};

fs.mkdirSync(resultsDir, { recursive: true });
fs.writeFileSync(path.join(resultsDir, 'summary.json'), JSON.stringify(summary, null, 2));

let current = '';
for (const row of rows) {
  if (row.scorecard !== current) {
    current = row.scorecard;
    console.log(`\n${current}`);
  }
  const label = row.result === 'pass' ? 'PASS' : row.result === 'fail' ? 'FAIL' : 'N/A ';
  console.log(`${label} ${row.id}: ${row.evidence}`);
}

if (unmapped.length > 0) {
  console.log('\nUnmapped failures');
  for (const entry of unmapped) console.log(`FAIL ${entry.id}: ${entry.evidence}`);
}

console.log(`\n${summary.pass} pass, ${summary.fail} fail, ${summary.not_applicable} not applicable`);
console.log(ok ? 'EVALUATION PASS' : 'EVALUATION FAIL');
if (!ok) process.exitCode = 1;
