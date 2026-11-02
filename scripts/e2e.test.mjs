import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { crossCheck, readClientYaml, repoRoot, validateClientData } from './lib/client-data.mjs';
import { renderBusinessTs } from './lib/generate-client.mjs';
import { helpText } from './help.mjs';
import { scaffoldAt } from './scaffold.mjs';

const root = repoRoot();

test('help names every npm script and keeps evaluate outside verify', () => {
  const scripts = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts;
  const text = helpText();
  for (const name of Object.keys(scripts)) {
    assert.match(text, new RegExp(`npm run ${name.replace(':', '\\:')}\\s`), name);
  }
  assert.match(text, /Does not replace verify/);
  assert.equal(scripts.verify.includes('evaluate'), false);
  assert.ok(scripts.evaluate.indexOf('evaluate:content') < scripts.evaluate.indexOf('evaluate:conversion'));
});

test('a fixture client can be scaffolded from facts without inventing claims', () => {
  const source = path.join(root, 'fixtures/plumber-urgent');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-scaffold-'));
  fs.mkdirSync(path.join(dir, 'client'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/config'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/content/services'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/content/service-areas'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'public'), { recursive: true });
  fs.copyFileSync(path.join(source, 'facts.yaml'), path.join(dir, 'client/facts.yaml'));
  fs.copyFileSync(path.join(source, 'strategy.yaml'), path.join(dir, 'client/strategy.yaml'));
  fs.copyFileSync(path.join(source, 'site-spec.yaml'), path.join(dir, 'client/site-spec.yaml'));
  fs.writeFileSync(path.join(dir, 'src/content/services/_example.md'), 'template\n');
  fs.writeFileSync(path.join(dir, 'src/content/services/drain-cleaning.md'), 'Example Plumbing sample page (555) 010-0199\n');
  fs.writeFileSync(path.join(dir, 'src/content/services/custom-notes.md'), 'client research notes\n');
  fs.writeFileSync(path.join(dir, 'src/content/service-areas/_example.md'), 'template\n');
  fs.writeFileSync(path.join(dir, 'src/content/service-areas/example-city.md'), 'Example City hello@example.com\n');
  fs.writeFileSync(path.join(dir, 'public/site.webmanifest'), '{ "name": "Old", "short_name": "Old", "theme_color": "#111111" }\n');
  fs.writeFileSync(path.join(dir, 'astro.config.mjs'), "export default { site: 'https://old.example', trailingSlash: 'always' };\n");
  fs.writeFileSync(path.join(dir, 'wrangler.jsonc'), '{ "name": "old-name", "compatibility_date": "2026-10-30" }\n');
  fs.writeFileSync(path.join(dir, 'src/config/business.ts'), 'placeholder\n');

  const facts = readClientYaml(path.join(dir, 'client/facts.yaml'));
  const strategy = readClientYaml(path.join(dir, 'client/strategy.yaml'));
  const spec = readClientYaml(path.join(dir, 'client/site-spec.yaml'));
  for (const [kind, data] of [['facts', facts], ['strategy', strategy], ['site-spec', spec]]) {
    const result = validateClientData(kind, data);
    assert.equal(result.ok, true, result.errors.join('; '));
  }
  assert.deepEqual(crossCheck({ facts, 'site-spec': spec }), []);

  const first = scaffoldAt(dir);
  assert.equal(first.ok, true, first.errors.join('; '));
  assert.equal(first.sample, false);

  const business = fs.readFileSync(path.join(dir, 'src/config/business.ts'), 'utf8');
  assert.equal(business, renderBusinessTs(facts, spec));
  assert.match(business, /businessName: 'Harbor Drain Co'/);
  assert.match(business, /showExampleBanner: false/);
  assert.match(business, /licenseNumber: ''/);
  assert.match(business, /statement: ''/);
  assert.match(business, /url: ''/);
  assert.match(business, /count: ''/);
  assert.match(business, /startingPrice: ''/);
  assert.match(business, /href: '\/services\/drain-clearing\/'/);
  assert.doesNotMatch(business, /licensed|insured|years in business|5-star|\$\d/i);

  const service = fs.readFileSync(path.join(dir, 'src/content/services/drain-clearing.md'), 'utf8');
  const city = fs.readFileSync(path.join(dir, 'src/content/service-areas/northwater.md'), 'utf8');
  for (const stub of [service, city]) {
    assert.match(stub, /scaffold-stub/);
    assert.match(stub, /Harbor Drain Co/);
    assert.match(stub, /does not add a license, a price, or a review count/);
    assert.doesNotMatch(stub, /licensed|insured|years in business|5-star|\$\d/);
  }
  assert.match(city, /Dockside/);
  assert.equal(fs.existsSync(path.join(dir, 'src/content/services/drain-cleaning.md')), false);
  assert.equal(fs.existsSync(path.join(dir, 'src/content/service-areas/example-city.md')), false);
  assert.equal(fs.readFileSync(path.join(dir, 'src/content/services/_example.md'), 'utf8'), 'template\n');
  assert.equal(fs.readFileSync(path.join(dir, 'src/content/services/custom-notes.md'), 'utf8'), 'client research notes\n');
  assert.match(fs.readFileSync(path.join(dir, 'public/site.webmanifest'), 'utf8'), /Harbor Drain Co/);
  assert.match(fs.readFileSync(path.join(dir, 'public/site.webmanifest'), 'utf8'), /#111111/);
  assert.match(fs.readFileSync(path.join(dir, 'astro.config.mjs'), 'utf8'), /https:\/\/harbor-drain\.example/);
  assert.match(fs.readFileSync(path.join(dir, 'wrangler.jsonc'), 'utf8'), /"name": "harbor-drain"/);
  assert.match(fs.readFileSync(path.join(dir, 'wrangler.jsonc'), 'utf8'), /2026-10-30/);
  assert.match(fs.readFileSync(path.join(dir, 'client/build-state.yaml'), 'utf8'), /phase: scaffold/);

  const second = scaffoldAt(dir);
  assert.deepEqual(second.notes, ['scaffold made no changes']);
  assert.equal(fs.readFileSync(path.join(dir, 'src/config/business.ts'), 'utf8'), business);
});
