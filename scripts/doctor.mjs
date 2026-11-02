import fs from 'node:fs';
import path from 'node:path';
import { business } from './lib/business.mjs';
import { isPublished, readClientYaml, repoRoot, validateClientData } from './lib/client-data.mjs';
import { loadClientInputs, resolveClientInputs } from './lib/client-files.mjs';
import { STUB_MARKER, pagesToBuild } from './lib/generate-client.mjs';

const root = repoRoot();
const lines = ['LOCAL SITE DOCTOR', ''];
const hard = [];

function ok(section, message) {
  lines.push(`${section ? '' : ''}`);
  lines.push(`✓ ${message}`);
}

function warn(message) {
  lines.push(`! ${message}`);
}

function fail(message) {
  hard.push(message);
  lines.push(`✗ ${message}`);
}

function section(title) {
  lines.push('', title);
}

const paths = resolveClientInputs(root);
let loaded;
try {
  loaded = loadClientInputs(paths);
} catch (error) {
  loaded = { errors: [error.message], facts: null, spec: null, withheld: [] };
}

section('CLIENT DATA');
if (paths.sample) warn('live client YAML is not present; using the Example Plumbing sample');
else ok('', `${path.basename(paths.factsPath)} is the live client file`);
if (loaded.errors.length) fail(loaded.errors.join('; '));
else {
  ok('', `${path.basename(paths.factsPath)} valid`);
  ok('', 'phone normalized');
  ok('', 'public address present');
  ok('', 'primary service present');
  const cityCount = loaded.facts.service_area.cities.length;
  ok('', `${cityCount} service ${cityCount === 1 ? 'city' : 'cities'}`);
}

section('CLAIMS');
if (loaded.facts) {
  const claims = loaded.facts.claims ?? {};
  for (const name of ['license', 'reviews_rating', 'reviews_count', 'financing']) {
    const claim = claims[name];
    if (!claim || !isPublished(claim)) ok('', `no unsupported ${name.replaceAll('_', ' ')} claim`);
    else ok('', `${name.replaceAll('_', ' ')} is publishable (${claim.status})`);
  }
  for (const item of loaded.withheld) warn(`${item} is recorded and must not be printed`);
  for (const [name, claim] of Object.entries(loaded.facts.claims ?? {})) {
    if (isPublished(claim) && typeof claim.value === 'boolean') {
      warn(`${name} is true and publishable, and this engine does not render that flag by itself`);
    }
  }
}

section('SITE PLAN');
if (loaded.spec && !loaded.errors.length) {
  const wanted = pagesToBuild(loaded.spec);
  ok('', `${path.basename(paths.specPath)} valid`);
  ok('', `${wanted.services.length} service ${wanted.services.length === 1 ? 'page' : 'pages'} marked build now or optimize`);
  ok('', `${wanted.areas.length} city ${wanted.areas.length === 1 ? 'page' : 'pages'} marked build now or optimize`);
  for (const page of wanted.services) {
    const file = path.join(root, 'src/content/services', `${page.slug}.md`);
    if (!fs.existsSync(file)) fail(`missing service page ${page.slug}`);
  }
  for (const page of wanted.areas) {
    const file = path.join(root, 'src/content/service-areas', `${page.slug}.md`);
    if (!fs.existsSync(file)) fail(`missing city page ${page.slug}`);
  }
}

section('CONTENT');
if (business.businessName === 'Example Plumbing' && business.showExampleBanner) {
  ok('', 'sample business is intentional on this repository');
} else {
  const markers = ['Example Plumbing', 'Example City', '(555) 010-0199', 'hello@example.com'];
  const hits = [];
  const text = fs.readFileSync(path.join(root, 'src/config/business.ts'), 'utf8');
  for (const marker of markers) if (text.includes(marker)) hits.push(marker);
  if (hits.length) fail(`sample strings remain in business.ts: ${hits.join(', ')}`);
  else ok('', 'sample business strings are gone from business.ts');
}
let stubs = 0;
for (const dir of ['services', 'service-areas']) {
  const folder = path.join(root, 'src/content', dir);
  if (!fs.existsSync(folder)) continue;
  for (const file of fs.readdirSync(folder)) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;
    if (fs.readFileSync(path.join(folder, file), 'utf8').includes(STUB_MARKER)) stubs += 1;
  }
}
if (stubs) warn(`${stubs} scaffold stub pages still need real copy`);

section('FOUNDATION');
const summaryPath = path.join(root, 'evaluations/results/summary.json');
if (!fs.existsSync(summaryPath)) warn('npm run verify has no recorded result');
else {
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  if (summary.ok) ok('', 'last recorded npm run verify passed');
  else fail('last recorded npm run verify failed');
}

section('VISUAL');
const statePath = path.join(root, 'client/build-state.yaml');
let state = null;
if (!paths.sample && fs.existsSync(statePath)) {
  state = readClientYaml(statePath);
  const stateResult = validateClientData('build-state', state);
  if (!stateResult.ok) fail(`build-state.yaml ${stateResult.errors.join('; ')}`);
}
if (!state || !['complete', 'passed'].includes(state.design?.status)) {
  warn('visual personalization not marked complete');
}

section('LEAD DELIVERY');
warn('production webhook not tested');

section('PRODUCTION');
if (business.site === 'https://example.com' || /localhost|127\.0\.0\.1/.test(business.site)) {
  warn(`domain is still ${business.site}`);
}
if (!state || state.production?.status !== 'passed') warn('production form submission not confirmed');

const done = new Set(['complete', 'validated', 'passed']);
let next = 'Run npm run client:generate and npm run scaffold.';
if (paths.sample) {
  next = 'This checkout is the Example Plumbing sample. Cut a client repository before building a business.';
} else if (hard.length) {
  next = 'Fix the failed client data checks above.';
} else if (state) {
  const order = [
    ['discovery', 'Finish discovery.'],
    ['facts', 'Validate the client facts.'],
    ['research', 'Finish market research.'],
    ['strategy', 'Finish positioning and conversion strategy.'],
    ['page_plan', 'Finish the page plan.'],
    ['site_spec', 'Validate the site spec.'],
    ['scaffold', 'Run npm run scaffold.'],
    ['content', 'Write a page brief for each build-now page, then replace the scaffold stubs.'],
    ['foundation_verify', 'Run npm run verify.'],
    ['design', 'Complete visual personalization.'],
    ['final_verify', 'Run npm run verify after the visual pass.'],
    ['production', 'Finish production QA, including one real lead.'],
  ];
  const pending = order.find(([key]) => !done.has(state[key]?.status));
  next = pending ? pending[1] : 'The recorded build state is complete.';
} else if (stubs) {
  next = 'Replace scaffold stubs with real pages.';
}

lines.push('', 'NEXT RECOMMENDED STEP', next, '');
console.log(lines.filter((line, index) => !(line === '' && lines[index - 1] === '')).join('\n').replace(/\n✓/g, '\n✓').replaceAll('\n\n✓', '\n✓'));
if (hard.length) process.exit(1);
