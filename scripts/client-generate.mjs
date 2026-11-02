import fs from 'node:fs';
import path from 'node:path';
import { repoRoot } from './lib/client-data.mjs';
import { loadClientInputs, resolveClientInputs } from './lib/client-files.mjs';
import { renderBusinessTs, updateManifest, writeIfChanged } from './lib/generate-client.mjs';

function args(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--facts') options.facts = argv[++index];
    else if (token === '--spec') options.spec = argv[++index];
    else if (token === '--check') options.check = true;
    else throw new Error(`Unknown argument ${token}`);
  }
  return options;
}

const options = args(process.argv.slice(2));
const root = repoRoot();
const paths = resolveClientInputs(root, options);
const loaded = loadClientInputs(paths);
if (loaded.errors.length) {
  for (const error of loaded.errors) console.error(`FAIL ${error}`);
  process.exit(1);
}

const businessPath = path.join(root, 'src/config/business.ts');
const manifestPath = path.join(root, 'public/site.webmanifest');
const businessNext = renderBusinessTs(loaded.facts, loaded.spec);
const manifestNext = updateManifest(fs.readFileSync(manifestPath, 'utf8'), loaded.facts.business.name);
const changes = [
  [businessPath, businessNext],
  [manifestPath, manifestNext],
].filter(([file, next]) => fs.readFileSync(file, 'utf8') !== next);

if (paths.sample) console.log('Using client/*.example.yaml because live client YAML is not present.');
if (options.check) {
  if (changes.length === 0) {
    console.log('PASS client:generate is up to date');
    process.exit(0);
  }
  for (const [file] of changes) console.error(`FAIL ${path.relative(root, file)} is out of date`);
  process.exit(1);
}

let wrote = false;
if (writeIfChanged(businessPath, businessNext)) {
  wrote = true;
  console.log('Wrote src/config/business.ts');
}
if (writeIfChanged(manifestPath, manifestNext)) {
  wrote = true;
  console.log('Wrote public/site.webmanifest');
}
if (!wrote) console.log('client:generate made no changes');
for (const item of loaded.withheld) console.log(`WITHHELD ${item}`);
