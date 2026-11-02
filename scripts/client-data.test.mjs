import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  CLAIM_STATUSES,
  CTA_TYPES,
  PAGE_STATUSES,
  PUBLISHABLE_STATUSES,
  WORKFLOW_STATUSES,
  crossCheck,
  readClientYaml,
  repoRoot,
  validateClientData,
} from './lib/client-data.mjs';

const root = repoRoot();

function facts() {
  return readClientYaml(path.join(root, 'client/facts.example.yaml'));
}

function enums(schema, pointer) {
  const value = pointer.split('/').filter(Boolean).reduce((node, key) => node[key], schema);
  return value.enum;
}

test('example client files validate', () => {
  const files = {
    facts: readClientYaml(path.join(root, 'client/facts.example.yaml')),
    strategy: readClientYaml(path.join(root, 'client/strategy.example.yaml')),
    'site-spec': readClientYaml(path.join(root, 'client/site-spec.example.yaml')),
    'build-state': readClientYaml(path.join(root, 'client/build-state.example.yaml')),
  };
  for (const [kind, data] of Object.entries(files)) {
    const result = validateClientData(kind, data);
    assert.deepEqual(result.errors, [], `${kind} ${result.errors.join('; ')}`);
    assert.equal(result.ok, true);
  }
  assert.deepEqual(crossCheck(files), []);
});

test('schema enums match the validator', () => {
  const factsSchema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/client-facts.schema.json'), 'utf8'));
  const strategySchema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/client-strategy.schema.json'), 'utf8'));
  const specSchema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/site-spec.schema.json'), 'utf8'));
  const stateSchema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/build-state.schema.json'), 'utf8'));
  assert.deepEqual(enums(factsSchema, '/$defs/claim/properties/status'), CLAIM_STATUSES);
  assert.deepEqual(enums(strategySchema, '/$defs/ctaType'), CTA_TYPES);
  assert.deepEqual(enums(specSchema, '/$defs/pageStatus'), PAGE_STATUSES);
  assert.deepEqual(enums(stateSchema, '/$defs/status'), WORKFLOW_STATUSES);
  for (const status of PUBLISHABLE_STATUSES) assert.ok(CLAIM_STATUSES.includes(status));
});

test('a license value with status unknown fails', () => {
  const data = facts();
  data.claims.license = { value: 'C-36 #123456', status: 'unknown' };
  const result = validateClientData('facts', data);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /claims\.license/);
});

test('an insured claim marked only as an inference is withheld, not published', () => {
  const data = facts();
  data.claims.insurance = { value: 'general liability', status: 'inferred_nonpublishable', source: 'trade guess' };
  const result = validateClientData('facts', data);
  assert.equal(result.ok, true);
  assert.deepEqual(result.withheld, ['claims.insurance (inferred_nonpublishable)']);
});

test('client_supplied claims need a source', () => {
  const data = facts();
  data.claims.license = { value: 'C-36 #123456', status: 'client_supplied' };
  const result = validateClientData('facts', data);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /source/);
});

test('duplicate service slugs fail', () => {
  const data = facts();
  data.services.offered.push({ name: 'Drain cleaning again', slug: 'drain-cleaning' });
  const result = validateClientData('facts', data);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /drain-cleaning/);
});

test('a mismatched phone fails', () => {
  const data = facts();
  data.contact.phone_display = '(555) 010-0100';
  const result = validateClientData('facts', data);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /same digits/);
});

test('a bad analytics id fails', () => {
  const data = facts();
  data.analytics.ga4 = 'UA-123';
  const result = validateClientData('facts', data);
  assert.equal(result.ok, false);
});

test('a bad hour and a bad locale fail', () => {
  const data = facts();
  data.hours[0].opens = '25:00';
  data.locale = 'english';
  const result = validateClientData('facts', data);
  assert.equal(result.ok, false);
  assert.ok(result.errors.length >= 2);
});

test('hours that close before they open fail', () => {
  const data = facts();
  data.hours[0].opens = '19:00';
  data.hours[0].closes = '07:00';
  const result = validateClientData('facts', data);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /open before/);
});

test('an unknown CTA type and page status fail', () => {
  const strategy = readClientYaml(path.join(root, 'client/strategy.example.yaml'));
  strategy.conversion.primary.type = 'buy_now';
  assert.equal(validateClientData('strategy', strategy).ok, false);

  const spec = readClientYaml(path.join(root, 'client/site-spec.example.yaml'));
  spec.pages.services[0].status = 'maybe';
  assert.equal(validateClientData('site-spec', spec).ok, false);
});

test('a webhook URL in client YAML fails', () => {
  const data = facts();
  data.profiles.facebook = 'https://webhook.site/abcd';
  const result = validateClientData('facts', data);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /secret/);
});

test('a site-spec page for an unknown service fails the cross-check', () => {
  const files = {
    facts: facts(),
    'site-spec': readClientYaml(path.join(root, 'client/site-spec.example.yaml')),
  };
  files['site-spec'].pages.services.push({
    slug: 'whole-home-repipe',
    status: 'build_now',
    primary_intent: 'hire a repipe crew',
  });
  assert.match(crossCheck(files).join('\n'), /whole-home-repipe/);
});
