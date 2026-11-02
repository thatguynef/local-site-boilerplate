import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { business } from '../lib/business.mjs';
import { loadClientInputs, resolveClientInputs } from '../lib/client-files.mjs';
import { publishedText } from '../lib/client-data.mjs';
import { pagesToBuild, renderBusinessTs } from '../lib/generate-client.mjs';
import { dist, pages, root, writeResult } from '../lib/html.mjs';
import { sampleLeakHits } from '../lib/sample-markers.mjs';
const SECRET_PATTERNS = [
  /CONTACT_WEBHOOK_URL\s*[:=]\s*['"]?https?:\/\//,
  /sk_live_[A-Za-z0-9]+/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/,
  /hooks\.slack\.com\/services\//,
  /webhook\.site\/[A-Za-z0-9-]+/,
  /ghp_[A-Za-z0-9]{20,}/,
];
const CLAIM_FIELDS = [
  ['response_time', business.responsePromise],
  ['license', business.licenseNumber],
  ['owner_name', business.ownerName],
  ['insurance', business.insurance],
  ['guarantee', business.guarantee],
  ['after_hours', business.afterHours],
  ['maintenance_plan', business.maintenancePlan],
  ['starting_price', business.startingPrice],
  ['reviews_rating', business.reviewsRating],
  ['reviews_count', business.reviewsCount],
];

function contentSlugs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .map((file) => file.slice(0, -3));
}

function walkText(dir, found = []) {
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walkText(full, found);
    } else if (/\.(mjs|js|ts|json|yaml|yml|svg|txt|css|html)$/.test(entry.name) && !entry.name.endsWith('.test.mjs')) {
      found.push(full);
    }
  }
  return found;
}

function localTargetExists(href) {
  const bare = href.split('#')[0].split('?')[0];
  if (!bare || bare.startsWith('#')) return true;
  const relative = bare.replace(/^\//, '');
  if (!relative) return fs.existsSync(path.join(dist, 'index.html'));
  const file = path.join(dist, relative);
  if (fs.existsSync(file)) return true;
  if (fs.existsSync(path.join(file, 'index.html'))) return true;
  if (!path.extname(relative) && fs.existsSync(`${file}.html`)) return true;
  return false;
}

const paths = resolveClientInputs(root);
const loaded = loadClientInputs(paths);
const specErrors = loaded.errors;
const generated = loaded.errors.length ? '' : renderBusinessTs(loaded.facts, loaded.spec);
const businessText = fs.readFileSync(path.join(root, 'src/config/business.ts'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/site.webmanifest'), 'utf8'));
const sampleIntentional = business.businessName === 'Example Plumbing' && business.showExampleBanner;

const pageProblems = [];
if (!specErrors.length) {
  const wanted = pagesToBuild(loaded.spec);
  for (const page of wanted.services) {
    const file = path.join(root, 'src/content/services', `${page.slug}.md`);
    if (!fs.existsSync(file)) pageProblems.push(`missing service page ${page.slug}`);
  }
  for (const page of wanted.areas) {
    const file = path.join(root, 'src/content/service-areas', `${page.slug}.md`);
    if (!fs.existsSync(file)) pageProblems.push(`missing city page ${page.slug}`);
  }
  const serviceSlugs = new Set((loaded.spec.pages?.services ?? []).map((page) => page.slug));
  const areaSlugs = new Set((loaded.spec.pages?.service_areas ?? []).map((page) => page.slug));
  for (const slug of contentSlugs(path.join(root, 'src/content/services'))) {
    if (!serviceSlugs.has(slug)) pageProblems.push(`orphan service page ${slug}`);
  }
  for (const slug of contentSlugs(path.join(root, 'src/content/service-areas'))) {
    if (!areaSlugs.has(slug)) pageProblems.push(`orphan city page ${slug}`);
  }
}

const claimProblems = [];
if (!specErrors.length) {
  for (const [name, value] of CLAIM_FIELDS) {
    const expected = publishedText(loaded.facts.claims?.[name]);
    if (value !== expected) claimProblems.push(`${name} is "${value}" and the publishable fact is "${expected}"`);
  }
  if (!publishedText(loaded.facts.claims?.financing) && business.financingStatement) {
    claimProblems.push('financing statement is set without a publishable claim');
  }
}

const leakHits = [];
if (!sampleIntentional) {
  const files = [
    path.join(root, 'src/config/business.ts'),
    path.join(root, 'public/site.webmanifest'),
    path.join(root, 'public/images/og-default.svg'),
    ...pages().map((page) => page.file),
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const marker of sampleLeakHits(text)) {
      leakHits.push(`${path.relative(root, file)} still contains ${marker}`);
    }
  }
}

let devVarsTracked = false;
try {
  devVarsTracked = execFileSync('git', ['ls-files', '--', '.dev.vars'], { cwd: root, encoding: 'utf8' }).trim().length > 0;
} catch {
  devVarsTracked = false;
}
const secretHits = [];
for (const file of [
  ...walkText(path.join(root, 'src')),
  ...walkText(path.join(root, 'client')),
  ...walkText(path.join(root, 'public')),
  ...walkText(path.join(root, 'scripts')),
]) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) secretHits.push(path.relative(root, file));
  }
}

const documents = pages();
const linkProblems = [];
for (const page of documents) {
  const refs = [...page.html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|data:)/.test(ref)) continue;
    if (!localTargetExists(ref)) linkProblems.push(`${page.url} → ${ref}`);
  }
}
const servicesIndex = documents.find((page) => page.url === '/services/');
const areasIndex = documents.find((page) => page.url === '/service-areas/');
for (const page of documents) {
  if (/^\/services\/[^/]+\/$/.test(page.url) && !servicesIndex?.html.includes(`href="${page.url}"`)) {
    linkProblems.push(`services index does not link ${page.url}`);
  }
  if (/^\/service-areas\/[^/]+\/$/.test(page.url) && !areasIndex?.html.includes(`href="${page.url}"`)) {
    linkProblems.push(`service-area index does not link ${page.url}`);
  }
}

const imageProblems = [];
for (const page of documents) {
  for (const tag of page.html.match(/<img\b[^>]*>/gi) ?? []) {
    const alt = (tag.match(/\balt="([^"]*)"/) ?? [])[1] ?? '';
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) imageProblems.push(`${page.url} image missing width or height`);
    if (alt.trim().length < 2 || /^(image|photo|picture|icon)$/i.test(alt.trim())) {
      imageProblems.push(`${page.url} image alt is not meaningful`);
    }
  }
}
function walkImages(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkImages(full);
    else if (/\.(?:png|jpe?g|webp|gif)$/i.test(entry.name) && fs.statSync(full).size > 1_500_000) {
      imageProblems.push(`${path.relative(root, full)} is over 1.5 MB`);
    }
  }
}
walkImages(dist);

const placeholderSite = business.site === 'https://example.com' || /localhost|127\.0\.0\.1/.test(business.site);
const assertions = [
  {
    id: 'client-spec',
    ok: specErrors.length === 0,
    evidence: specErrors.length ? specErrors.join('; ') : `Validated ${path.basename(paths.factsPath)} and ${path.basename(paths.specPath)}`,
  },
  {
    id: 'generated-config',
    ok: specErrors.length === 0 && generated === businessText && manifest.name === business.businessName && manifest.short_name === business.businessName,
    evidence: generated === businessText ? 'business.ts and the manifest name match the client YAML' : 'business.ts does not match client YAML. Run npm run client:generate',
  },
  {
    id: 'client-pages',
    ok: pageProblems.length === 0,
    evidence: pageProblems.length ? pageProblems.join('; ') : 'Build-now pages exist and content files are in the site spec',
  },
  {
    id: 'client-claims',
    ok: claimProblems.length === 0,
    evidence: claimProblems.length ? claimProblems.join('; ') : 'Published trust fields match claim provenance',
  },
  {
    id: 'sample-leak',
    ok: leakHits.length === 0,
    evidence: sampleIntentional
      ? 'Example Plumbing remains the intentional sample'
      : leakHits.length ? leakHits.slice(0, 8).join('; ') : 'No sample business strings in the built site',
  },
  {
    id: 'production-safety',
    ok: !devVarsTracked && secretHits.length === 0 && (sampleIntentional || !placeholderSite),
    evidence: [
      devVarsTracked ? '.dev.vars is tracked' : '',
      secretHits.length ? `secret-like value in ${[...new Set(secretHits)].join(', ')}` : '',
      !sampleIntentional && placeholderSite ? `site origin is still ${business.site}` : '',
    ].filter(Boolean).join('; ') || (sampleIntentional ? 'Sample origin is intentional. No tracked .dev.vars or secret assignment.' : 'No tracked .dev.vars, secret assignment, or placeholder origin.'),
  },
  {
    id: 'internal-targets',
    ok: linkProblems.length === 0,
    evidence: linkProblems.length ? linkProblems.slice(0, 8).join('; ') : 'Internal links and service links resolve',
  },
  {
    id: 'image-integrity',
    ok: imageProblems.length === 0,
    evidence: imageProblems.length ? imageProblems.join('; ') : 'Content images have dimensions and alt text, and no raster file is over 1.5 MB',
  },
];

writeResult('check-client', assertions);
