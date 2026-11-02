import fs from 'node:fs';
import path from 'node:path';
import { publishedText } from './client-data.mjs';

const NAV = [
  ['/', 'Home'],
  ['/services/', 'Services'],
  ['/service-areas/', 'Service areas'],
  ['/about/', 'About'],
  ['/faq/', 'FAQ'],
  ['/contact/', 'Contact'],
];

export function tsString(value) {
  const text = String(value);
  if (/[\n\r]/.test(text)) throw new Error('business.ts cannot store a multi-line value');
  return `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function tsNumber(value) {
  if (!Number.isFinite(value)) throw new Error('business.ts received a non-finite number');
  return String(value);
}

function serviceHref(slug, spec) {
  const page = (spec.pages?.services ?? []).find((item) => item.slug === slug);
  if (page && (page.status === 'build_now' || page.status === 'optimize')) return `/services/${slug}/`;
  return '/contact/';
}

function areaServed(facts) {
  const cities = (facts.service_area?.cities ?? []).map((city) => city.name);
  const neighborhoods = (facts.service_area?.neighborhoods ?? []).filter((name) => !cities.includes(name));
  return [...cities, ...neighborhoods];
}

function services(facts, spec) {
  return [...(facts.services?.primary ?? []), ...(facts.services?.offered ?? [])].map((service) => ({
    name: service.name,
    href: serviceHref(service.slug, spec),
  }));
}

function sameAs(facts) {
  const profiles = facts.profiles ?? {};
  return [profiles.google_business_profile, profiles.facebook, profiles.yelp]
    .map((url) => String(url ?? '').trim())
    .filter(Boolean);
}

function blockList(items, render, pad) {
  if (items.length === 0) return '[]';
  return `[\n${items.map((item) => render(item)).join('\n')}\n${pad}]`;
}

export function renderBusinessTs(facts, spec) {
  const claims = facts.claims ?? {};
  const text = (name) => publishedText(claims[name]);
  const hours = facts.hours ?? [];
  const links = services(facts, spec);
  const areas = areaServed(facts);
  const profiles = sameAs(facts);
  const banner = spec.sample_banner === true;

  const hourBlocks = blockList(
    hours,
    (block) => `    {
      days: [${block.days.map((day) => tsString(day)).join(', ')}],
      opens: ${tsString(block.opens)},
      closes: ${tsString(block.closes)},
    },`,
    '  ',
  );
  const serviceBlocks = blockList(
    links,
    (service) => `    { name: ${tsString(service.name)}, href: ${tsString(service.href)} },`,
    '  ',
  );
  const stringList = (values) => `[${values.map((value) => tsString(value)).join(', ')}]`;
  const nav = (items) => items.map(([href, label]) => `    { href: ${tsString(href)}, label: ${tsString(label)} },`).join('\n');

  return `export type OpeningHours = {
  days: string[];
  opens: string;
  closes: string;
};

export type ServiceLink = {
  name: string;
  href: string;
};

export const business = {
  businessName: ${tsString(facts.business.name)},
  schemaType: ${tsString(facts.business.schema_type)},
  trade: ${tsString(facts.business.trade)},
  primaryService: ${tsString(facts.business.primary_service)},
  phoneDisplay: ${tsString(facts.contact.phone_display)},
  phoneTel: ${tsString(facts.contact.phone_tel)},
  email: ${tsString(facts.contact.email)},
  address: {
    street: ${tsString(facts.address.street)},
    city: ${tsString(facts.address.city)},
    region: ${tsString(facts.address.region)},
    postalCode: ${tsString(facts.address.postal_code)},
    country: ${tsString(facts.address.country)},
  },
  geo: {
    latitude: ${tsNumber(facts.geo.latitude)},
    longitude: ${tsNumber(facts.geo.longitude)},
  },
  serviceArea: ${tsString(facts.service_area.summary)},
  areaServed: ${stringList(areas)},
  neighborhoods: ${stringList(facts.service_area.neighborhoods ?? [])},
  primaryServices: ${serviceBlocks} satisfies ServiceLink[],
  openingHours: ${hourBlocks} satisfies OpeningHours[],
  hoursDisplay: ${tsString(facts.hours_display)},
  responsePromise: ${tsString(text('response_time'))},
  locale: ${tsString(facts.locale)},
  lang: ${tsString(facts.lang)},
  ogImage: '/images/og-default.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  showExampleBanner: ${banner},
  sameAs: ${profiles.length ? stringList(profiles) : '[]'} as string[],
  ownerName: ${tsString(text('owner_name'))},
  licenseNumber: ${tsString(text('license'))},
  licenses: [] as string[],
  afterHours: ${tsString(text('after_hours'))},
  financing: {
    statement: '',
    url: '',
  },
  maintenancePlan: ${tsString(text('maintenance_plan'))},
  insurance: ${tsString(text('insurance'))},
  guarantee: ${tsString(text('guarantee'))},
  reviews: {
    rating: ${tsString(text('reviews_rating'))},
    count: ${tsString(text('reviews_count'))},
    source: '',
    url: '',
  },
  startingPrice: ${tsString(text('starting_price'))},
  analytics: {
    ga4: ${tsString(facts.analytics?.ga4 ?? '')},
    gtm: ${tsString(facts.analytics?.gtm ?? '')},
  },
  mainNav: [
${nav(NAV)}
  ],
  footerNav: [
${nav([...NAV, ['/privacy/', 'Privacy']])}
  ],
};

export type Business = typeof business;
`;
}

export function updateManifest(text, name) {
  const data = JSON.parse(text);
  if (data.name === name && data.short_name === name) return text;
  return `${JSON.stringify({ ...data, name, short_name: name }, null, 2)}\n`;
}

export function updateSiteOrigin(text, domain) {
  const origin = String(domain).replace(/\/$/, '');
  return text.replace(/site:\s*'[^']*'/, `site: '${origin}'`);
}

export function updateWorkerName(text, name) {
  return text.replace(/"name":\s*"[^"]*"/, `"name": "${name}"`);
}

export function writeIfChanged(file, next) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current === next) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, next);
  return true;
}

const STUB_MARKER = 'scaffold-stub';

function yaml(value) {
  return JSON.stringify(String(value));
}

export function serviceStub(service, facts) {
  const city = facts.address.city;
  const phone = facts.contact.phone_display;
  const name = service.name;
  return `---
title: ${yaml(`${name} in ${city}`)}
seoTitle: ${yaml(`${name} in ${city}`)}
description: ${yaml(`${name} for homes in ${city}. Call ${phone}.`)}
answer: ${yaml(`${facts.business.name} offers ${name} in ${city}. Call ${phone}. This page is a scaffold stub and still needs a real description of the job.`)}
processTitle: ${yaml(`How to request ${name}`)}
steps:
  - name: Call
    text: ${yaml(`Call ${phone} and say you need ${name} in ${city}.`)}
  - name: Confirm the address
    text: ${yaml(`Confirm the address is in ${city} before anyone schedules the visit.`)}
faqs:
  - q: ${yaml(`Where is ${name} available?`)}
    a: ${yaml(`${name} is listed for ${city}. Call ${phone} to confirm the address is inside the service area.`)}
  - q: ${yaml(`How do I request ${name}?`)}
    a: ${yaml(`Call ${phone} or use the contact form. This stub does not add a license, a price, or a review count.`)}
---

<!-- ${STUB_MARKER}: replace this page before launch -->

${name} in ${city} starts with a call to ${phone}. Replace this stub with the job, the area, and the questions customers ask.
`;
}

export function areaStub(city, facts) {
  const phone = facts.contact.phone_display;
  const trade = facts.business.trade;
  const neighborhoods = facts.service_area.neighborhoods ?? [];
  if (neighborhoods.length === 0) {
    throw new Error(`city page ${city.slug} needs at least one neighborhood in facts`);
  }
  const placeList = neighborhoods.map((name) => `  - ${yaml(name)}`).join('\n');
  return `---
title: ${yaml(`${trade} in ${city.name}`)}
seoTitle: ${yaml(`${trade} in ${city.name}`)}
description: ${yaml(`${facts.business.name} serves ${city.name}. Call ${phone}.`)}
city: ${yaml(city.name)}
neighborhoods:
${placeList}
answer: ${yaml(`${facts.business.name} serves ${city.name}. Call ${phone}. This page is a scaffold stub and still needs local detail.`)}
processTitle: ${yaml(`How to request service in ${city.name}`)}
steps:
  - name: Call
    text: ${yaml(`Call ${phone} and name the city and the job.`)}
  - name: Confirm the neighborhood
    text: ${yaml(`Confirm the address is in ${city.name} before anyone schedules the visit.`)}
faqs:
  - q: ${yaml(`Which places in ${city.name} are served?`)}
    a: ${yaml(`The page lists ${neighborhoods.join(', ')}. Call ${phone} if the address is not on that list.`)}
  - q: ${yaml(`How do I request service in ${city.name}?`)}
    a: ${yaml(`Call ${phone} or use the contact form. This stub does not add a license, a price, or a review count.`)}
---

<!-- ${STUB_MARKER}: replace this page before launch -->

${facts.business.name} lists ${city.name} as a city it serves. Replace this stub with the neighborhoods and the jobs offered there.
`;
}

export function renderBuildState() {
  return `version: 1
phase: scaffold

discovery:
  status: not_started
facts:
  status: validated
research:
  status: not_started
strategy:
  status: not_started
page_plan:
  status: not_started
site_spec:
  status: validated
scaffold:
  status: complete
content:
  status: not_started
foundation_verify:
  status: pending
design:
  status: not_started
final_verify:
  status: pending
production:
  status: pending
`;
}

export function pagesToBuild(spec) {
  const wanted = new Set(['build_now', 'optimize']);
  return {
    services: (spec.pages?.services ?? []).filter((page) => wanted.has(page.status)),
    areas: (spec.pages?.service_areas ?? []).filter((page) => wanted.has(page.status)),
  };
}

export { STUB_MARKER };
