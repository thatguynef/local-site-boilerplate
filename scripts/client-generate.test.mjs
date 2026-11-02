import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { business, readJsString } from './lib/business.mjs';
import { readClientYaml, repoRoot } from './lib/client-data.mjs';
import { renderBusinessTs, serviceStub, tsString, updateManifest, updateSiteOrigin, updateWorkerName } from './lib/generate-client.mjs';
import { scaffoldAt } from './scaffold.mjs';

const root = repoRoot();

function loadExamples() {
  return {
    facts: readClientYaml(path.join(root, 'client/facts.example.yaml')),
    spec: readClientYaml(path.join(root, 'client/site-spec.example.yaml')),
  };
}

test('example facts render the current business.ts', () => {
  const { facts, spec } = loadExamples();
  const rendered = renderBusinessTs(facts, spec);
  const current = fs.readFileSync(path.join(root, 'src/config/business.ts'), 'utf8');
  assert.equal(rendered, current);
});

test('rendering twice is stable', () => {
  const { facts, spec } = loadExamples();
  assert.equal(renderBusinessTs(facts, spec), renderBusinessTs(facts, spec));
});

test('an unpublished license is not written', () => {
  const { facts, spec } = loadExamples();
  facts.claims.license = { value: 'C-36 #123456', status: 'unknown' };
  assert.match(renderBusinessTs(facts, spec), /licenseNumber: ''/);
  assert.doesNotMatch(renderBusinessTs(facts, spec), /C-36/);
});

test('a sourced license is written and an apostrophe is escaped', () => {
  const { facts, spec } = loadExamples();
  facts.business.name = "Joe's Plumbing";
  facts.claims.license = { value: 'C-36 #123456', status: 'client_supplied', source: 'license card' };
  const rendered = renderBusinessTs(facts, spec);
  assert.match(rendered, /licenseNumber: 'C-36 #123456'/);
  assert.match(rendered, /businessName: 'Joe\\'s Plumbing'/);
  const parsed = readJsString(rendered, rendered.indexOf("businessName: '") + "businessName: ".length);
  assert.equal(parsed.value, "Joe's Plumbing");
  assert.equal(tsString("Joe's Plumbing"), "'Joe\\'s Plumbing'");
});

test('a true emergency flag does not invent emergency copy', () => {
  const { facts, spec } = loadExamples();
  facts.claims.emergency_service = { value: true, status: 'client_confirmed' };
  const rendered = renderBusinessTs(facts, spec);
  assert.doesNotMatch(rendered, /24\/7|emergency/i);
});

test('manifest, site, and worker edits keep the rest of the file', () => {
  const manifest = fs.readFileSync(path.join(root, 'public/site.webmanifest'), 'utf8');
  assert.equal(updateManifest(manifest, 'Example Plumbing'), manifest);
  const renamed = updateManifest(manifest, 'North Side Plumbing');
  assert.match(renamed, /"name": "North Side Plumbing"/);
  assert.match(renamed, /"theme_color": "#0c4a4a"/);

  const config = "export default { site: 'https://example.com', trailingSlash: 'always' };\n";
  assert.equal(updateSiteOrigin(config, 'https://north.example'), "export default { site: 'https://north.example', trailingSlash: 'always' };\n");
  const wrangler = '{\n  "name": "local-site-boilerplate",\n  "compatibility_date": "2026-10-30"\n}\n';
  assert.match(updateWorkerName(wrangler, 'north-side'), /"name": "north-side"/);
  assert.match(updateWorkerName(wrangler, 'north-side'), /2026-10-30/);
});

test('the sample parser still reads Example Plumbing', () => {
  assert.equal(business.businessName, 'Example Plumbing');
  assert.equal(business.primaryServiceUrl, '/services/drain-cleaning/');
  assert.equal(business.licenseNumber, '');
  assert.equal(business.showExampleBanner, true);
});

test('scaffold creates a missing page, keeps existing copy, and is idempotent', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-'));
  fs.mkdirSync(path.join(dir, 'client'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/config'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/content/services'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/content/service-areas'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'public/images'), { recursive: true });
  fs.copyFileSync(path.join(root, 'client/facts.example.yaml'), path.join(dir, 'client/facts.yaml'));
  const spec = readClientYaml(path.join(root, 'client/site-spec.example.yaml'));
  spec.pages.services.push({
    slug: 'water-heater-repair',
    status: 'build_now',
    primary_intent: 'hire water heater repair',
  });
  spec.project.worker_name = 'example-plumbing';
  fs.writeFileSync(path.join(dir, 'client/site-spec.yaml'), `project:\n  domain: https://example.com\n  primary_language: en\n  locale: en_US\n  worker_name: example-plumbing\nbrand:\n  personality: [dependable]\n  visual_direction: [practical]\n  avoid: []\nconversion:\n  primary: { type: phone, label: Call }\n  secondary: { type: request_service, label: Request service }\npages:\n  home: { enabled: true }\n  about: { enabled: true }\n  faq: { enabled: true }\n  services:\n    - { slug: drain-cleaning, status: build_now, primary_intent: hire drain cleaning }\n    - { slug: water-heater-repair, status: build_now, primary_intent: hire water heater repair }\n    - { slug: leak-detection, status: contact_only, primary_intent: ask about leak detection }\n  service_areas:\n    - { slug: example-city, status: build_now, primary_intent: find a plumber in Example City }\ncontent_strategy:\n  answer_first: true\n  customer_language: plain\nvisual:\n  design_freedom: high\n  preserve_foundation_contracts: true\nsample_banner: true\n`);
  fs.writeFileSync(path.join(dir, 'src/content/services/_example.md'), 'keep me\n');
  fs.writeFileSync(path.join(dir, 'src/content/services/drain-cleaning.md'), 'existing drain copy\n');
  fs.writeFileSync(path.join(dir, 'src/content/service-areas/_example.md'), 'keep me\n');
  fs.writeFileSync(path.join(dir, 'public/site.webmanifest'), fs.readFileSync(path.join(root, 'public/site.webmanifest')));
  fs.writeFileSync(path.join(dir, 'astro.config.mjs'), "export default { site: 'https://old.example', trailingSlash: 'always' };\n");
  fs.writeFileSync(path.join(dir, 'wrangler.jsonc'), '{ "name": "old-name", "compatibility_date": "2026-10-30" }\n');
  fs.writeFileSync(path.join(dir, 'src/config/business.ts'), 'export const business = {};\n');

  const first = scaffoldAt(dir);
  assert.equal(first.ok, true, first.errors.join('; '));
  assert.equal(fs.readFileSync(path.join(dir, 'src/content/services/_example.md'), 'utf8'), 'keep me\n');
  assert.equal(fs.readFileSync(path.join(dir, 'src/content/services/drain-cleaning.md'), 'utf8'), 'existing drain copy\n');
  const stub = fs.readFileSync(path.join(dir, 'src/content/services/water-heater-repair.md'), 'utf8');
  assert.match(stub, /scaffold-stub/);
  assert.match(stub, /\(555\) 010-0199/);
  assert.doesNotMatch(stub, /licensed|insured|years in business|5-star/i);
  assert.match(fs.readFileSync(path.join(dir, 'astro.config.mjs'), 'utf8'), /https:\/\/example.com/);
  assert.match(fs.readFileSync(path.join(dir, 'wrangler.jsonc'), 'utf8'), /example-plumbing/);
  assert.match(fs.readFileSync(path.join(dir, 'wrangler.jsonc'), 'utf8'), /2026-10-30/);
  assert.equal(fs.existsSync(path.join(dir, 'client/build-state.yaml')), true);

  const before = fs.readFileSync(path.join(dir, 'src/config/business.ts'), 'utf8');
  const second = scaffoldAt(dir);
  assert.deepEqual(second.notes, ['scaffold made no changes']);
  assert.equal(fs.readFileSync(path.join(dir, 'src/config/business.ts'), 'utf8'), before);
  assert.equal(serviceStub({ name: 'Water heater repair', slug: 'water-heater-repair' }, loadExamples().facts).includes('C-36'), false);
});

test('scaffold removes only obsolete sample pages for a real client', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-client-'));
  fs.mkdirSync(path.join(dir, 'client'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/config'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/content/services'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/content/service-areas'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'public'), { recursive: true });
  fs.copyFileSync(path.join(root, 'client/facts.example.yaml'), path.join(dir, 'client/facts.yaml'));
  let factsText = fs.readFileSync(path.join(dir, 'client/facts.yaml'), 'utf8');
  factsText = factsText
    .replaceAll('Example Plumbing', 'North Side Plumbing')
    .replace('primary_service: Drain cleaning', 'primary_service: Water heater repair')
    .replace(
      `  primary:\n    - name: Drain cleaning\n      slug: drain-cleaning\n  offered:\n    - name: Water heater repair\n      slug: water-heater-repair\n    - name: Leak detection\n      slug: leak-detection`,
      `  primary:\n    - name: Water heater repair\n      slug: water-heater-repair\n  offered: []`,
    );
  fs.writeFileSync(path.join(dir, 'client/facts.yaml'), factsText);
  fs.copyFileSync(path.join(root, 'client/site-spec.example.yaml'), path.join(dir, 'client/site-spec.yaml'));
  let specText = fs.readFileSync(path.join(dir, 'client/site-spec.yaml'), 'utf8');
  specText = specText.replace(
    `  services:\n    - slug: drain-cleaning\n      status: build_now\n      primary_intent: hire drain cleaning in Example City\n    - slug: water-heater-repair\n      status: contact_only\n      primary_intent: ask about water heater repair\n    - slug: leak-detection\n      status: contact_only\n      primary_intent: ask about leak detection\n  service_areas:\n    - slug: example-city\n      status: build_now\n      primary_intent: find a plumber in Example City`,
    `  services:\n    - slug: water-heater-repair\n      status: build_now\n      primary_intent: hire water heater repair\n  service_areas: []`,
  );
  fs.writeFileSync(path.join(dir, 'client/site-spec.yaml'), specText);
  fs.writeFileSync(path.join(dir, 'src/content/services/_example.md'), 'template\n');
  fs.writeFileSync(path.join(dir, 'src/content/services/drain-cleaning.md'), 'Example Plumbing sample page (555) 010-0199\n');
  fs.writeFileSync(path.join(dir, 'src/content/services/custom-notes.md'), 'client research notes\n');
  fs.writeFileSync(path.join(dir, 'src/content/service-areas/example-city.md'), 'Example Plumbing in Example City hello@example.com\n');
  fs.writeFileSync(path.join(dir, 'public/site.webmanifest'), '{ "name": "Old", "short_name": "Old", "theme_color": "#111111" }\n');
  fs.writeFileSync(path.join(dir, 'astro.config.mjs'), "export default { site: 'https://example.com' };\n");
  fs.writeFileSync(path.join(dir, 'src/config/business.ts'), 'placeholder\n');

  const result = scaffoldAt(dir);
  assert.equal(result.ok, true, result.errors.join('; '));
  assert.equal(fs.existsSync(path.join(dir, 'src/content/services/drain-cleaning.md')), false);
  assert.equal(fs.existsSync(path.join(dir, 'src/content/service-areas/example-city.md')), false);
  assert.equal(fs.existsSync(path.join(dir, 'src/content/services/_example.md')), true);
  assert.equal(fs.readFileSync(path.join(dir, 'src/content/services/custom-notes.md'), 'utf8'), 'client research notes\n');
  assert.match(fs.readFileSync(path.join(dir, 'public/site.webmanifest'), 'utf8'), /#111111/);
  assert.match(fs.readFileSync(path.join(dir, 'src/config/business.ts'), 'utf8'), /North Side Plumbing/);
  assert.doesNotMatch(fs.readFileSync(path.join(dir, 'src/config/business.ts'), 'utf8'), /licenseNumber: 'C-/);
});
