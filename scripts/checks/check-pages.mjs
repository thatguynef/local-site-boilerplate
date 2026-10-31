import { headings, pages, strip, writeResult } from '../lib/html.mjs';
import { business, intentPages, requiredPages } from '../lib/business.mjs';

const documents = pages();
const byUrl = new Map(documents.map((page) => [page.url, page]));
const missing = requiredPages.filter((url) => !byUrl.has(url));
const h1Problems = [];
const headingProblems = [];
const intentProblems = [];

for (const page of documents) {
  const found = headings(page.html);
  const h1s = found.filter((item) => item.level === 1);
  if (h1s.length !== 1) h1Problems.push(`${page.url} has ${h1s.length} H1 elements`);
  let previous = 0;
  for (const heading of found) {
    if (previous === 0 && heading.level !== 1) headingProblems.push(`${page.url} starts at H${heading.level}`);
    if (previous > 0 && heading.level > previous + 1) headingProblems.push(`${page.url} skips from H${previous} to H${heading.level}`);
    previous = heading.level;
  }
}

const serviceWord = /drain|plumb/i;
for (const url of intentPages) {
  const page = byUrl.get(url);
  if (!page) {
    intentProblems.push(`${url} missing`);
    continue;
  }
  const title = (page.html.match(/<title>([\s\S]*?)<\/title>/i) ?? [])[1] ?? '';
  const description = (page.html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i) ?? [])[0] ?? '';
  const descriptionText = (description.match(/content=["']([^"']*)["']/i) ?? [])[1] ?? '';
  const h1 = headings(page.html).find((item) => item.level === 1)?.text ?? '';
  for (const [label, value] of [['title', strip(title)], ['description', descriptionText], ['H1', h1]]) {
    if (!serviceWord.test(value) || !value.includes(business.city)) {
      intentProblems.push(`${url} ${label} is "${value}"`);
    }
  }
}

function has(url, pattern) {
  const page = byUrl.get(url);
  return Boolean(page && pattern.test(page.html));
}

const home = byUrl.get('/');
const homeText = home ? strip(home.html) : '';
const service = byUrl.get('/services/drain-cleaning/');
const location = byUrl.get('/service-areas/example-city/');
const servicesIndex = byUrl.get('/services/');
const linked = ['/services/drain-cleaning/', '/service-areas/example-city/', '/faq/', '/about/', '/contact/']
  .filter((url) => !home?.html.includes(`href="${url}"`));

const assertions = [
  {
    id: 'required-pages',
    ok: missing.length === 0,
    evidence: missing.length ? `Missing ${missing.join(', ')}` : `All ${requiredPages.length} required pages are built`,
  },
  {
    id: 'single-h1',
    ok: h1Problems.length === 0,
    evidence: h1Problems.length ? h1Problems.join('; ') : 'Every HTML document has one H1',
  },
  {
    id: 'heading-hierarchy',
    ok: headingProblems.length === 0,
    evidence: headingProblems.length ? headingProblems.join('; ') : 'Heading levels do not skip',
  },
  {
    id: 'internal-links',
    ok: linked.length === 0,
    evidence: linked.length ? `Home is missing links to ${linked.join(', ')}` : 'Home links to the service, location, FAQ, about, and contact pages',
  },
  {
    id: 'RL-UND-01',
    ok: homeText.includes(business.primaryService),
    evidence: homeText.includes(business.primaryService)
      ? `Home names ${business.primaryService}`
      : `Home does not name ${business.primaryService}`,
  },
  {
    id: 'RL-UND-02',
    ok: homeText.includes(business.city),
    evidence: `Home ${homeText.includes(business.city) ? 'names' : 'does not name'} ${business.city}`,
  },
  {
    id: 'RL-UND-03',
    ok: /data-answer/.test(home?.html ?? '') && homeText.length > 80,
    evidence: 'Home opens with an answer paragraph',
  },
  {
    id: 'RL-UND-04',
    ok: has('/', /href="\/contact\/"|href="tel:/),
    evidence: 'Home offers a call link or the contact form',
  },
  {
    id: 'RL-UND-06',
    ok: has('/', /href="\/services\/"/),
    evidence: 'Main navigation includes Services',
  },
  {
    id: 'RL-UND-07',
    ok: Boolean(location) && strip(location?.html ?? '').includes(business.city) && business.neighborhoods.some((name) => location.html.includes(name)),
    evidence: `Location page exists for ${business.city}`,
  },
  {
    id: 'RL-FND-01',
    ok: intentProblems.length === 0,
    evidence: intentProblems.length ? intentProblems.join('; ') : 'Home, service, and location titles, descriptions, and H1s combine a service word with the city',
  },
  {
    id: 'RL-FND-04',
    ok: Boolean(service && location) && headings(service.html)[0]?.text !== headings(location.html)[0]?.text,
    evidence: `Service H1 "${headings(service?.html ?? '')[0]?.text ?? ''}"; location H1 "${headings(location?.html ?? '')[0]?.text ?? ''}"`,
  },
  {
    id: 'RL-CON-08',
    ok: ['/', '/services/drain-cleaning/', '/about/', '/contact/'].every((url) => has(url, /href="\/contact\/"|href="tel:|action="\/api\/contact"/)),
    evidence: 'Home, service, about, and contact pages each offer a call or the form',
  },
  {
    id: 'LV-INTENT',
    ok: intentProblems.length === 0,
    evidence: intentProblems.length ? intentProblems.join('; ') : 'Indexable service and location pages use service and city language',
  },
  {
    id: 'LV-UNIQUE',
    ok: Boolean(service && location && servicesIndex) && new Set([
      headings(service.html)[0]?.text,
      headings(location.html)[0]?.text,
      headings(servicesIndex.html)[0]?.text,
    ]).size === 3,
    evidence: 'Service index, service detail, and location page have different H1s',
  },
  {
    id: 'GBP-SERVICES',
    ok: business.serviceNames.every((name) => servicesIndex?.html.includes(name)),
    evidence: `Services index lists ${business.serviceNames.join(', ')}`,
  },
];

writeResult('check-pages', assertions);
