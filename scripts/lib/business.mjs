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

export const business = {
  businessName: quoted('businessName'),
  schemaType: quoted('schemaType'),
  primaryService: quoted('primaryService'),
  phoneDisplay: quoted('phoneDisplay'),
  phoneTel: quoted('phoneTel'),
  email: quoted('email'),
  street: quoted('street'),
  city: quoted('city'),
  region: quoted('region'),
  postalCode: quoted('postalCode'),
  hoursDisplay: quoted('hoursDisplay'),
  responsePromise: quoted('responsePromise'),
  serviceNames: [...source.matchAll(/\{\s*name:\s*'([^']+)',\s*href:/g)].map((item) => item[1]),
  neighborhoods: list('neighborhoods'),
  areaServed: list('areaServed'),
  ga4: quoted('ga4'),
  gtm: quoted('gtm'),
  site: (config.match(/site:\s*'([^']+)'/)?.[1] ?? '').replace(/\/$/, ''),
};

export const requiredPages = [
  '/',
  '/services/',
  '/services/drain-cleaning/',
  '/service-areas/',
  '/service-areas/example-city/',
  '/about/',
  '/contact/',
  '/thank-you/',
  '/privacy/',
  '/faq/',
  '/404.html',
];

export const intentPages = [
  '/',
  '/services/',
  '/services/drain-cleaning/',
  '/service-areas/',
  '/service-areas/example-city/',
];
