import { digits, headings, jsonLd, pages, section, strip, writeResult } from '../lib/html.mjs';
import { business } from '../lib/business.mjs';

const documents = pages();
const problems = [];
const faqMismatches = [];
const serviceProblems = [];
const breadcrumbProblems = [];
const howtoProblems = [];
const graphProblems = [];

function typesOf(node) {
  const value = node?.['@type'];
  return Array.isArray(value) ? value : [value].filter(Boolean);
}

for (const page of documents) {
  let nodes = [];
  try {
    nodes = jsonLd(page.html);
  } catch (error) {
    problems.push(`${page.url} JSON-LD did not parse (${error.message})`);
    continue;
  }
  if (nodes.length === 0) problems.push(`${page.url} has no JSON-LD`);

  const website = nodes.find((node) => typesOf(node).includes('WebSite'));
  const local = nodes.find((node) => typesOf(node).includes(business.schemaType) || typesOf(node).includes('LocalBusiness'));
  if (!website) graphProblems.push(`${page.url} missing WebSite`);
  if (website?.potentialAction) graphProblems.push(`${page.url} WebSite has a SearchAction`);
  if (!local) graphProblems.push(`${page.url} missing ${business.schemaType}`);
  if (local) {
    const address = local.address ?? {};
    const geo = local.geo ?? {};
    const hours = local.openingHoursSpecification ?? [];
    const areas = (local.areaServed ?? []).map((area) => area.name);
    if (local.name !== business.businessName) problems.push(`${page.url} schema name`);
    if (!samePhone(local.telephone, business.phoneTel)) problems.push(`${page.url} schema telephone`);
    if (address.streetAddress !== business.street) problems.push(`${page.url} schema street`);
    if (address.addressLocality !== business.city) problems.push(`${page.url} schema city`);
    if (address.addressRegion !== business.region) problems.push(`${page.url} schema region`);
    if (address.postalCode !== business.postalCode) problems.push(`${page.url} schema postal code`);
    if (typeof geo.latitude !== 'number' || typeof geo.longitude !== 'number') problems.push(`${page.url} schema geo`);
    if (!hours.length || !hours.some((item) => (item.dayOfWeek ?? []).includes('Monday') && item.opens === '07:00' && item.closes === '19:00')) {
      problems.push(`${page.url} schema hours`);
    }
    for (const area of business.areaServed) {
      if (!areas.includes(area)) problems.push(`${page.url} schema areaServed missing ${area}`);
    }
  }
  if (nodes.some((node) => typesOf(node).includes('SearchAction') || node.potentialAction)) {
    graphProblems.push(`${page.url} includes SearchAction`);
  }

  const faqNodes = nodes.filter((node) => typesOf(node).includes('FAQPage'));
  const faqHtml = section(page.html, 'data-faq');
  const visibleFaqs = faqHtml
    ? [...faqHtml.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => ({
      q: strip(match[1]),
      a: strip(match[2]),
    }))
    : [];
  if (visibleFaqs.length > 0) {
    const entities = faqNodes[0]?.mainEntity ?? [];
    if (faqNodes.length !== 1 || entities.length !== visibleFaqs.length) {
      faqMismatches.push(`${page.url} FAQ count schema=${entities.length} visible=${visibleFaqs.length}`);
    } else {
      visibleFaqs.forEach((faq, index) => {
        const entity = entities[index];
        if (entity?.name !== faq.q || entity?.acceptedAnswer?.text !== faq.a) {
          faqMismatches.push(`${page.url} FAQ text mismatch at ${index + 1}`);
        }
      });
    }
  } else if (faqNodes.length > 0) {
    faqMismatches.push(`${page.url} has FAQPage schema without a visible FAQ`);
  }

  const isServiceDetail = page.url.startsWith('/services/') && page.url !== '/services/';
  const service = nodes.find((node) => typesOf(node).includes('Service'));
  const h1 = headings(page.html).find((item) => item.level === 1)?.text ?? '';
  if (isServiceDetail) {
    if (!service || service.name !== h1) serviceProblems.push(`${page.url} Service schema does not match the H1`);
  } else if (service) {
    serviceProblems.push(`${page.url} has Service schema without being a service detail page`);
  }

  const crumbs = nodes.find((node) => typesOf(node).includes('BreadcrumbList'));
  const expectCrumbs = page.url !== '/' && page.url !== '/404.html';
  if (expectCrumbs && !crumbs) breadcrumbProblems.push(`${page.url} missing BreadcrumbList`);
  if (!expectCrumbs && crumbs) breadcrumbProblems.push(`${page.url} should not have BreadcrumbList`);

  const processHtml = section(page.html, 'data-process');
  const processTitle = processHtml ? strip((processHtml.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i) ?? [])[1] ?? '') : '';
  const howto = nodes.find((node) => typesOf(node).includes('HowTo'));
  if (processTitle) {
    if (!howto || howto.name !== processTitle) howtoProblems.push(`${page.url} HowTo name does not match "${processTitle}"`);
  } else if (howto) {
    howtoProblems.push(`${page.url} has HowTo schema without a visible process`);
  }
}

function samePhone(left, right) {
  const a = digits(String(left ?? ''));
  const b = digits(String(right ?? ''));
  return Boolean(a && b && (a.endsWith(b) || b.endsWith(a)));
}

const servicePage = documents.find((page) => page.url === business.primaryServiceUrl);
const serviceHowTo = servicePage ? jsonLd(servicePage.html).some((node) => typesOf(node).includes('HowTo')) : false;
const faqPage = documents.find((page) => page.url === '/faq/');
const faqSchema = faqPage ? jsonLd(faqPage.html).some((node) => typesOf(node).includes('FAQPage')) : false;

const assertions = [
  {
    id: 'jsonld-parse',
    ok: problems.length === 0,
    evidence: problems.length ? problems.join('; ') : `${documents.length} pages have a ${business.schemaType} graph with address, geo, hours, and areaServed`,
  },
  {
    id: 'jsonld-faq-match',
    ok: faqMismatches.length === 0,
    evidence: faqMismatches.length ? faqMismatches.join('; ') : 'FAQPage text matches the visible questions and answers',
  },
  {
    id: 'jsonld-service',
    ok: serviceProblems.length === 0,
    evidence: serviceProblems.length ? serviceProblems.join('; ') : 'Service schema is limited to service detail pages and matches the H1',
  },
  {
    id: 'jsonld-breadcrumb',
    ok: breadcrumbProblems.length === 0,
    evidence: breadcrumbProblems.length ? breadcrumbProblems.join('; ') : 'BreadcrumbList is present on inner pages and omitted on home and 404',
  },
  {
    id: 'jsonld-howto',
    ok: howtoProblems.length === 0,
    evidence: howtoProblems.length ? howtoProblems.join('; ') : 'HowTo schema matches the visible process heading',
  },
  {
    id: 'RL-FND-03',
    ok: problems.length === 0,
    evidence: problems.length ? problems.join('; ') : `Schema name, phone, and street match ${business.businessName}`,
  },
  {
    id: 'GEO-FAQ-SCHEMA',
    ok: faqSchema && faqMismatches.length === 0,
    evidence: faqSchema ? 'FAQ page publishes FAQPage schema that matches visible answers' : 'FAQ page has no FAQPage schema',
  },
  {
    id: 'GEO-HOWTO',
    ok: serviceHowTo && howtoProblems.length === 0,
    evidence: serviceHowTo ? `${business.primaryService} page publishes HowTo schema` : `${business.primaryService} page has no HowTo schema`,
  },
  {
    id: 'GEO-GRAPH',
    ok: graphProblems.length === 0 && problems.length === 0,
    evidence: graphProblems.length ? graphProblems.join('; ') : 'Every page has WebSite and local business schema, with no SearchAction',
  },
  {
    id: 'GBP-HOURS',
    ok: problems.length === 0 && documents.every((page) => page.html.includes(business.hoursDisplay)),
    evidence: `Visible hours "${business.hoursDisplay}" and schema hours Monday 07:00-19:00`,
  },
  {
    id: 'LV-AREA',
    ok: problems.length === 0 && business.neighborhoods.every((name) => documents.some((page) => strip(page.html).includes(name))),
    evidence: `areaServed covers ${business.areaServed.join(', ')}`,
  },
];

writeResult('check-jsonld', assertions);
