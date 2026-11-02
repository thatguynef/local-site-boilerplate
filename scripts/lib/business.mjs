import fs from 'node:fs';
import path from 'node:path';
import { root } from './html.mjs';

const source = fs.readFileSync(path.join(root, 'src/config/business.ts'), 'utf8');
const config = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');

function quoted(name) {
  const match = source.match(new RegExp(`\\b${name}:\\s*'([^']*)'`));
  return match?.[1] ?? '';
}

function list(name) {
  const match = source.match(new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`));
  if (!match) return [];
  return [...match[1].matchAll(/'([^']*)'/g)].map((item) => item[1]);
}

const serviceLinks = [...source.matchAll(/\{\s*name:\s*'([^']+)',\s*href:\s*'([^']+)'/g)].map((item) => ({
  name: item[1],
  href: item[2],
}));

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
  responsePromise: quoted('responsePromise'),
  serviceNames: serviceLinks.map((item) => item.name),
  primaryServiceUrl,
  primaryCityUrl,
  tradeWordPattern: tradeWordPattern(trade, primaryService),
  neighborhoods: list('neighborhoods'),
  areaServed: list('areaServed'),
  licenseNumber: quoted('licenseNumber'),
  licenses: list('licenses'),
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
