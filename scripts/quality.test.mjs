import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { contentFindings } from './quality/content.mjs';
import { conversionFindings } from './quality/conversion.mjs';
import { repoRoot } from './lib/client-data.mjs';

const root = repoRoot();

function page(url, html) {
  return { url, html: `<main>${html}</main>` };
}

const phoneStrategy = {
  conversion: {
    primary: { type: 'phone', label: 'Call' },
    secondary: { type: 'request_service', label: 'Request service' },
    response_expectation: { enabled: true },
    emergency: { prioritize_phone: false },
  },
  positioning: { avoid_positioning: ['cheapest'] },
};

test('layout primitives do not name a trade or the sample business', () => {
  const dir = path.join(root, 'src/components/primitives');
  const banned = /plumber|hvac|roofing|electrician|Example Plumbing|drain cleaning/i;
  for (const file of fs.readdirSync(dir)) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    assert.doesNotMatch(text, banned, file);
  }
});

test('content review flags a dependent phrase, a repeated answer, and a cloned page', () => {
  const clean = page('/', '<p data-answer>We clear the line. Call the number on this page.</p>');
  assert.deepEqual(contentFindings([clean]), []);

  const dependent = contentFindings([
    page('/services/drain-cleaning/', '<p data-answer>See above for the phone number.</p>'),
  ]);
  assert.equal(dependent.some((item) => item.id === 'dependent-phrase'), true);

  const duplicated = contentFindings([
    page('/', `<section data-faq><h3>One?</h3><p>Same answer here.</p><h3>Two?</h3><p>Same answer here.</p></section>`),
  ]);
  assert.equal(duplicated.some((item) => item.id === 'duplicate-faq'), true);

  const cloned = contentFindings([
    page('/services/one/', '<p data-answer>Identical answer for two services.</p>'),
    page('/services/two/', '<p data-answer>Identical answer for two services.</p>'),
  ]);
  assert.equal(cloned.some((item) => item.id === 'cloned-answer'), true);
});

test('conversion review follows the strategy and ignores layout', () => {
  const home = page('/', '<a class="header-phone" href="tel:+15550100199">Call</a><a href="/contact/">Request</a>');
  const contact = page('/contact/', '<a href="tel:+15550100199">Call</a><p>We call back within one hour.</p>');
  const thanks = page('/thank-you/', '<p>We call back within one hour.</p>');
  const base = {
    documents: [home, contact, thanks],
    strategy: phoneStrategy,
    phoneTel: '+15550100199',
    responseText: 'We call back within one hour.',
    financingOffered: false,
    emergencyPublished: false,
  };
  assert.deepEqual(conversionFindings(base), []);

  const missingPhone = conversionFindings({
    ...base,
    documents: [page('/', '<a href="/contact/">Request</a>'), contact, thanks],
  });
  assert.equal(missingPhone.some((item) => item.id === 'cta-phone'), true);

  const emergency = conversionFindings({
    ...base,
    strategy: {
      ...phoneStrategy,
      conversion: { ...phoneStrategy.conversion, emergency: { prioritize_phone: true } },
    },
  });
  assert.equal(emergency.some((item) => item.id === 'emergency-claim'), true);

  const boast = conversionFindings({
    ...base,
    documents: [page('/', '<a href="tel:+15550100199">Call</a><a href="/contact/">Request</a><p>We are the cheapest.</p>'), contact, thanks],
  });
  assert.equal(boast.some((item) => item.id === 'avoid-positioning'), true);
});

test('verify does not run the quality commands', () => {
  const runAll = fs.readFileSync(path.join(root, 'scripts/run-all.sh'), 'utf8');
  const scripts = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts;
  assert.equal(runAll.includes('evaluate'), false);
  assert.equal(scripts.verify.includes('evaluate'), false);
  assert.ok(scripts.evaluate.indexOf('evaluate:content') < scripts.evaluate.indexOf('evaluate:conversion'));
});
