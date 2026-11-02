import fs from 'node:fs';
import path from 'node:path';
import { loadClientInputs, resolveClientInputs } from '../lib/client-files.mjs';
import { dist, pages, root, writeResult } from '../lib/html.mjs';
import { budgetFromSpec, performanceFindings } from '../performance/budget.mjs';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

let documents;
try {
  documents = pages();
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.error('Build the site first. This command reads dist/client and also runs inside npm run verify.');
    process.exit(1);
  }
  throw error;
}

const assets = walk(dist).map((file) => ({
  path: path.relative(dist, file).split(path.sep).join('/'),
  bytes: fs.statSync(file).size,
}));
const css = assets
  .filter((file) => file.path.endsWith('.css'))
  .map((file) => fs.readFileSync(path.join(dist, file.path), 'utf8'))
  .join('\n');

let budget;
try {
  const loaded = loadClientInputs(resolveClientInputs(root));
  budget = budgetFromSpec(loaded.errors.length ? {} : loaded.spec);
} catch {
  budget = budgetFromSpec({});
}

const findings = performanceFindings({ documents, files: assets, css, budget });
writeResult('check-performance', [
  {
    id: 'performance-budget',
    ok: findings.length === 0,
    evidence: findings.length
      ? findings.map((item) => item.evidence).join('; ')
      : `Client JavaScript, CSS, images, and fonts are inside the budget`,
  },
]);
