import fs from 'node:fs';
import path from 'node:path';
import { root } from './html.mjs';

const source = fs.readFileSync(path.join(root, 'src/config/business.ts'), 'utf8');
const config = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');

export function readJsString(text, quoteIndex) {
  let index = quoteIndex + 1;
  let value = '';
  while (index < text.length) {
    const char = text[index];
    if (char === '\\') {
      value += text[index + 1] ?? '';
      index += 2;
      continue;
    }
    if (char === "'") return { value, end: index };
    value += char;
    index += 1;
  }
  return { value, end: index };
}

function quoted(name) {
  const match = source.match(new RegExp(`\\b${name}:\\s*'`));
  if (!match) return '';
  return readJsString(source, match.index + match[0].length - 1).value;
}

function list(name) {
  const match = source.match(new RegExp(`${name}:\\s*\\[`));
  if (!match) return [];
  const values = [];
  const start = match.index + match[0].length;
  const end = source.indexOf(']', start);
  const body = source.slice(start, end === -1 ? undefined : end);
  for (let index = 0; index < body.length; index += 1) {
    if (body[index] !== "'") continue;
    const item = readJsString(body, index);
    values.push(item.value);
    index = item.end;
  }
  return values;
}

function openingHours() {
  const start = source.indexOf('openingHours:');
  const end = source.indexOf('hoursDisplay:', start);
  const body = start === -1 ? '' : source.slice(start, end === -1 ? undefined : end);
  return [...body.matchAll(/days:\s*\[([^\]]*)\][\s\S]*?opens:\s*'([^']*)'[\s\S]*?closes:\s*'([^']*)'/g)].map(
    (item) => ({
      days: [...item[1].matchAll(/'([^']*)'/g)].map((day) => day[1]),
      opens: item[2],
      closes: item[3],
    }),
  );
}

function serviceLinksFrom(text) {
  const links = [];
  const pattern = /\{\s*name:\s*'/g;
  for (const match of text.matchAll(pattern)) {
    const name = readJsString(text, match.index + match[0].length - 1);
    const hrefStart = text.slice(name.end + 1).match(/^\s*,\s*href:\s*'/);
    if (!hrefStart) continue;
    const href = readJsString(text, name.end + hrefStart[0].length);
    links.push({ name: name.value, href: href.value });
  }
  return links;
}

const serviceLinks = serviceLinksFrom(source);

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function servicePageUrl(services, primaryService) {
  const match = services.find(
    (item) =>
      item.name.toLowerCase() === primaryService.toLowerCase() && /^\/services\/[^/]+\/$/.test(item.href),
  );
  return match?.href ?? '';
}

export function cityPageUrl(city) {
  const slug = slugify(city);
  return slug ? `/service-areas/${slug}/` : '';
}

export function tradeWordPattern(trade, primaryService) {
  const words = `${trade} ${primaryService}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 4);
  const tokens = words.flatMap((word) =>
    word.endsWith('ing') && word.length > 6 ? [word, word.slice(0, -3)] : [word],
  );
  const unique = [...new Set(tokens)];
  if (unique.length === 0) return /$^/;
  return new RegExp(unique.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
}

const trade = quoted('trade');
const primaryService = quoted('primaryService');
const city = quoted('city');
const primaryServiceUrl = servicePageUrl(serviceLinks, primaryService);
const primaryCityUrl = cityPageUrl(city);

export const business = {
  businessName: quoted('businessName'),
  schemaType: quoted('schemaType'),
  trade,
  primaryService,
  phoneDisplay: quoted('phoneDisplay'),
  phoneTel: quoted('phoneTel'),
  email: quoted('email'),
  street: quoted('street'),
  city,
  region: quoted('region'),
  postalCode: quoted('postalCode'),
  hoursDisplay: quoted('hoursDisplay'),
  openingHours: openingHours(),
  responsePromise: quoted('responsePromise'),
  serviceNames: serviceLinks.map((item) => item.name),
  primaryServiceUrl,
  primaryCityUrl,
  tradeWordPattern: tradeWordPattern(trade, primaryService),
  neighborhoods: list('neighborhoods'),
  areaServed: list('areaServed'),
  licenseNumber: quoted('licenseNumber'),
  licenses: list('licenses'),
  ownerName: quoted('ownerName'),
  insurance: quoted('insurance'),
  guarantee: quoted('guarantee'),
  afterHours: quoted('afterHours'),
  maintenancePlan: quoted('maintenancePlan'),
  startingPrice: quoted('startingPrice'),
  financingStatement: quoted('statement'),
  reviewsRating: quoted('rating'),
  reviewsCount: quoted('count'),
  showExampleBanner: /showExampleBanner:\s*true/.test(source),
  ga4: quoted('ga4'),
  gtm: quoted('gtm'),
  site: (config.match(/site:\s*'([^']+)'/)?.[1] ?? '').replace(/\/$/, ''),
};

export const requiredPages = [
  '/',
  '/services/',
  primaryServiceUrl,
  '/service-areas/',
  primaryCityUrl,
  '/about/',
  '/contact/',
  '/thank-you/',
  '/privacy/',
  '/faq/',
  '/404.html',
];

export const intentPages = ['/', '/services/', primaryServiceUrl, '/service-areas/', primaryCityUrl];
