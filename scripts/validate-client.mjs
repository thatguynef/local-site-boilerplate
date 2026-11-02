import fs from 'node:fs';
import path from 'node:path';
import { crossCheck, kindFromFilename, readClientYaml, repoRoot, validateClientData } from './lib/client-data.mjs';

const root = repoRoot();

const pairs = [
  ['facts', 'client/facts.example.yaml', 'client/facts.yaml'],
  ['strategy', 'client/strategy.example.yaml', 'client/strategy.yaml'],
  ['site-spec', 'client/site-spec.example.yaml', 'client/site-spec.yaml'],
  ['build-state', 'client/build-state.example.yaml', 'client/build-state.yaml'],
  ['page-briefs', 'client/page-briefs.example.yaml', 'client/page-briefs.yaml'],
];

function filesToCheck(args) {
  if (args.length) {
    return args.map((arg) => {
      const file = path.resolve(arg);
      const kind = kindFromFilename(file);
      if (!kind) throw new Error(`Cannot tell which schema matches ${arg}`);
      return { kind, file };
    });
  }
  const files = [];
  for (const [kind, example, live] of pairs) {
    files.push({ kind, file: path.join(root, example) });
    const livePath = path.join(root, live);
    if (fs.existsSync(livePath)) files.push({ kind, file: livePath });
  }
  return files;
}

const args = process.argv.slice(2);
let failed = false;
const loaded = {};
let liveSpec = false;
let liveBriefs = false;

for (const { kind, file } of filesToCheck(args)) {
  const label = path.relative(root, file);
  let data;
  try {
    data = readClientYaml(file);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${label}: ${error.message}`);
    continue;
  }
  const result = validateClientData(kind, data);
  const base = path.basename(file);
  if (!args.length && base.endsWith('.example.yaml')) loaded[kind] = data;
  if (!args.length && base === `${kind}.yaml`) {
    loaded[kind] = data;
    if (kind === 'site-spec') liveSpec = true;
    if (kind === 'page-briefs') liveBriefs = true;
  }
  if (!result.ok) {
    failed = true;
    for (const error of result.errors) console.error(`FAIL ${label}: ${error}`);
    continue;
  }
  console.log(`PASS ${label}`);
  for (const item of result.withheld) console.log(`WITHHELD ${label}: ${item}`);
}

if (!args.length && loaded.facts && loaded['site-spec']) {
  const files = { facts: loaded.facts, 'site-spec': loaded['site-spec'] };
  // Example briefs describe the sample spec. Do not compare them with a live spec
  // that does not have its own briefs yet.
  if (!liveSpec || liveBriefs) files['page-briefs'] = loaded['page-briefs'];
  for (const error of crossCheck(files)) {
    failed = true;
    console.error(`FAIL client: ${error}`);
  }
}

if (failed) process.exit(1);
