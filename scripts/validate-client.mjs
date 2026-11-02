import fs from 'node:fs';
import path from 'node:path';
import { crossCheck, kindFromFilename, readClientYaml, repoRoot, validateClientData } from './lib/client-data.mjs';

const root = repoRoot();

const pairs = [
  ['facts', 'client/facts.example.yaml', 'client/facts.yaml'],
  ['strategy', 'client/strategy.example.yaml', 'client/strategy.yaml'],
  ['site-spec', 'client/site-spec.example.yaml', 'client/site-spec.yaml'],
  ['build-state', 'client/build-state.example.yaml', 'client/build-state.yaml'],
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
  if (!args.length && path.basename(file).endsWith('.example.yaml')) loaded[kind] = data;
  if (!args.length && path.basename(file) === `${kind}.yaml`) loaded[kind] = data;
  if (!result.ok) {
    failed = true;
    for (const error of result.errors) console.error(`FAIL ${label}: ${error}`);
    continue;
  }
  console.log(`PASS ${label}`);
  for (const item of result.withheld) console.log(`WITHHELD ${label}: ${item}`);
}

if (!args.length && loaded.facts && loaded['site-spec']) {
  for (const error of crossCheck(loaded)) {
    failed = true;
    console.error(`FAIL client: ${error}`);
  }
}

if (failed) process.exit(1);
