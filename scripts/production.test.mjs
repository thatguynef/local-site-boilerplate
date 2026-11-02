import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { repoRoot } from './lib/client-data.mjs';
import { budgetFromSpec, DEFAULT_BUDGET, performanceFindings } from './performance/budget.mjs';
import { findingsForRepo, isForbiddenTrackedFile, securityFindings } from './security/scan.mjs';

const root = repoRoot();

test('security scan accepts the example secret file and rejects a real secret', () => {
  assert.equal(isForbiddenTrackedFile('.dev.vars.example'), false);
  assert.equal(isForbiddenTrackedFile('.env.example'), false);
  assert.equal(isForbiddenTrackedFile('.dev.vars'), true);
  assert.equal(isForbiddenTrackedFile('.env'), true);
  assert.equal(isForbiddenTrackedFile('exports/leads.csv'), true);

  const placeholder = securityFindings([
    { path: '.dev.vars.example', text: '# CONTACT_WEBHOOK_URL=https://example.com/hooks/leads' },
  ]);
  assert.deepEqual(placeholder, []);

  const site = securityFindings([
    { path: 'public/favicon.svg', text: '<svg xmlns="http://www.w3.org/2000/svg"></svg>' },
  ]);
  assert.deepEqual(site, []);

  const http = securityFindings([
    { path: 'src/pages/index.astro', text: '<a href="http://crm.client.test/book">Book</a>' },
  ]);
  assert.equal(http.some((item) => item.id === 'insecure-link'), true);

  assert.equal(findingsForRepo(root).length, 0);
});

test('performance budgets fail a heavy or font-hosted page and pass an empty one', () => {
  const clean = performanceFindings({
    documents: [{ url: '/', html: '<main><p>Call.</p></main>' }],
    files: [{ path: '_astro/site.css', bytes: 20_000 }],
    css: 'body { color: black; } @media (prefers-reduced-motion: reduce) {}',
  });
  assert.deepEqual(clean, []);

  const heavy = performanceFindings({
    documents: [{ url: '/', html: '<main></main>' }],
    files: [{ path: '_astro/site.js', bytes: 80 * 1024 }],
    css: '',
  });
  assert.equal(heavy.some((item) => item.id === 'client-js'), true);

  const hosted = performanceFindings({
    documents: [{ url: '/', html: '<link href="https://fonts.googleapis.com/css?family=A" rel="stylesheet">' }],
    files: [],
    css: '',
  });
  assert.equal(hosted.some((item) => item.id === 'external-font'), true);

  const video = performanceFindings({
    documents: [{ url: '/', html: '<video autoplay src="/hero.mp4"></video>' }],
    files: [],
    css: '',
  });
  assert.equal(video.some((item) => item.id === 'video-hero'), true);

  const allowed = performanceFindings({
    documents: [{ url: '/', html: '<video src="/hero.mp4"></video>' }],
    files: [],
    css: '',
    budget: { ...DEFAULT_BUDGET, decorative_video_hero: true, external_fonts: true },
  });
  assert.equal(allowed.some((item) => item.id === 'video-hero' || item.id === 'external-font'), false);

  const raised = budgetFromSpec({ performance: { max_client_js_kb: 200 } });
  assert.equal(raised.max_client_js_kb, 200);
  assert.equal(raised.max_css_kb, DEFAULT_BUDGET.max_css_kb);
});

test('verify runs the security and performance checks', () => {
  const runAll = fs.readFileSync(path.join(root, 'scripts/run-all.sh'), 'utf8');
  const checks = fs.readdirSync(path.join(root, 'scripts/checks'));
  assert.match(runAll, /scripts\/checks\/\*\.mjs/);
  assert.equal(checks.includes('check-security.mjs'), true);
  assert.equal(checks.includes('check-performance.mjs'), true);
});
