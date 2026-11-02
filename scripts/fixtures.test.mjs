import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { crossCheck, readClientYaml, repoRoot, validateClientData } from './lib/client-data.mjs';
import { renderBusinessTs } from './lib/generate-client.mjs';
import { sampleLeakHits } from './lib/sample-markers.mjs';

const root = repoRoot();
const names = [
  'plumber-urgent',
  'hvac-replacement',
  'electrician-service-area',
  'roofer-estimate',
  'minimal-new-business',
];

function load(name) {
  const dir = path.join(root, 'fixtures', name);
  return {
    facts: readClientYaml(path.join(dir, 'facts.yaml')),
    strategy: readClientYaml(path.join(dir, 'strategy.yaml')),
    spec: readClientYaml(path.join(dir, 'site-spec.yaml')),
    text: fs.readdirSync(dir).map((file) => fs.readFileSync(path.join(dir, file), 'utf8')).join('\n'),
  };
}

test('fixtures validate and do not assume Example Plumbing', () => {
  const cityCounts = [];
  for (const name of names) {
    const loaded = load(name);
    for (const [kind, data] of [['facts', loaded.facts], ['strategy', loaded.strategy], ['site-spec', loaded.spec]]) {
      const result = validateClientData(kind, data);
      assert.equal(result.ok, true, `${name} ${kind}: ${result.errors.join('; ')}`);
    }
    assert.deepEqual(crossCheck({ facts: loaded.facts, 'site-spec': loaded.spec }), []);
    const rendered = renderBusinessTs(loaded.facts, loaded.spec);
    assert.deepEqual(sampleLeakHits(`${rendered}\n${loaded.text}`), [], name);
    assert.equal(rendered.includes('Licensed and insured'), false, name);
    assert.match(rendered, /licenseNumber: ''/, name);
    assert.match(rendered, /statement: ''/, name);
    assert.match(rendered, /ga4: ''/, name);
    assert.equal(loaded.facts.lang, 'en', name);
    assert.equal(loaded.spec.project.primary_language, 'en', name);
    assert.equal(loaded.facts.claims.reviews_rating.value, '', name);
    assert.equal(loaded.facts.claims.financing.value, '', name);
    assert.equal(loaded.facts.claims.after_hours.value, '', name);
    assert.equal(loaded.facts.analytics.ga4, '', name);
    assert.equal(loaded.text.includes('CONTACT_WEBHOOK'), false, name);
    cityCounts.push(loaded.facts.service_area.cities.length);
  }
  assert.equal(Math.min(...cityCounts), 1);
  assert.ok(Math.max(...cityCounts) >= 4);
});

test('the hvac fixture publishes a maintenance plan and the urgent plumber does not publish emergency service', () => {
  const hvac = load('hvac-replacement');
  const plumber = load('plumber-urgent');
  assert.match(renderBusinessTs(hvac.facts, hvac.spec), /Spring and fall tune-ups/);
  assert.equal(hvac.facts.services.offered.length >= 2, true);
  assert.equal(plumber.facts.services.offered, undefined);
  assert.equal(plumber.facts.claims.emergency_service.value, false);
  assert.equal(renderBusinessTs(plumber.facts, plumber.spec).includes('emergency'), false);
});

test('the roofer fixture asks for an estimate and the electrician keeps one language', () => {
  const roofer = load('roofer-estimate');
  const electric = load('electrician-service-area');
  assert.equal(roofer.strategy.conversion.secondary.type, 'request_estimate');
  assert.match(electric.strategy.audience.primary.join(' '), /Spanish-speaking/);
  assert.equal(electric.facts.service_area.cities.length, 4);
  assert.equal(electric.facts.services.primary.length, 1);
});
