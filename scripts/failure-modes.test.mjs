import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { readClientYaml, repoRoot, validateClientData } from './lib/client-data.mjs';
import { missingContactFields } from './lib/form-contract.mjs';
import { renderBusinessTs } from './lib/generate-client.mjs';
import { phonesMatch } from './lib/phones.mjs';
import { sampleLeakHits } from './lib/sample-markers.mjs';
import { contentFindings } from './quality/content.mjs';
import { securityFindings } from './security/scan.mjs';

const root = repoRoot();

function page(url, html) {
  return { url, html: `<main>${html}</main>` };
}

test('an unsupported license claim fails and an inference is not rendered', () => {
  const facts = readClientYaml(path.join(root, 'fixtures/plumber-urgent/facts.yaml'));
  const spec = readClientYaml(path.join(root, 'fixtures/plumber-urgent/site-spec.yaml'));
  facts.claims.license = { value: 'Licensed and insured', status: 'unknown' };
  assert.equal(validateClientData('facts', facts).ok, false);

  facts.claims.license = { value: 'Licensed and insured', status: 'inferred_nonpublishable' };
  const rendered = renderBusinessTs(facts, spec);
  assert.equal(rendered.includes('Licensed and insured'), false);
  assert.match(rendered, /licenseNumber: ''/);
});

test('cloned city answers are flagged', () => {
  const answer = '<p data-answer>We serve this city. Call the number on this page.</p>';
  const findings = contentFindings([
    page('/service-areas/north-bend/', answer),
    page('/service-areas/cedar-flats/', answer),
    page('/service-areas/mill-crossing/', answer),
  ]);
  assert.equal(findings.filter((item) => item.id === 'cloned-answer').length, 2);
});

test('a drifted phone number does not match the NAP source', () => {
  assert.equal(phonesMatch('(555) 010-2001', '+15550102001'), true);
  assert.equal(phonesMatch('(555) 010-2001', '+15550109999'), false);
  const nap = fs.readFileSync(path.join(root, 'scripts/checks/check-nap.mjs'), 'utf8');
  assert.match(nap, /phonesMatch/);
});

test('a logo and color swap is a failed uniqueness review', () => {
  const skill = fs.readFileSync(path.join(root, 'agent-skills/quality/visual-uniqueness/SKILL.md'), 'utf8');
  assert.match(skill, /logo, color, name, and phone swap/);
  assert.match(skill, /unrelated contractor/);
  assert.match(skill, /not part of `npm run verify`/);
});

test('renaming preferredTime fails the form contract', () => {
  const html = '<form><input name="service"><input name="area"><textarea name="message"></textarea><input name="preferredWindow"></form>';
  assert.deepEqual(missingContactFields(html), ['preferredTime']);
  const check = fs.readFileSync(path.join(root, 'scripts/checks/check-form.mjs'), 'utf8');
  assert.match(check, /missingContactFields/);
});

test('a committed webhook URL fails the security check', () => {
  const leaked = securityFindings([
    { path: 'client/facts.yaml', text: 'CONTACT_WEBHOOK_URL=https://crm.client.test/hooks/leads' },
  ]);
  assert.equal(leaked.some((item) => item.id === 'webhook-url'), true);

  const named = securityFindings([
    { path: 'src/pages/api/contact.ts', text: 'const webhook = env.CONTACT_WEBHOOK_URL;' },
  ]);
  assert.deepEqual(named, []);

  const logged = securityFindings([
    { path: 'src/pages/api/contact.ts', text: 'console.log(lead.email);' },
  ]);
  assert.equal(logged.some((item) => item.id === 'form-log'), true);
});

test('Example Plumbing left in the manifest is sample leakage', () => {
  const hits = sampleLeakHits('{"name":"Example Plumbing","short_name":"Example Plumbing"}');
  assert.equal(hits.includes('Example Plumbing'), true);
  const check = fs.readFileSync(path.join(root, 'scripts/checks/check-client.mjs'), 'utf8');
  assert.match(check, /sampleLeakHits/);
});
