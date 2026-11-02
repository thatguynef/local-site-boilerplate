import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import Ajv from 'ajv/dist/2020.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const CLAIM_STATUSES = [
  'verified_public',
  'client_supplied',
  'client_confirmed',
  'inferred_nonpublishable',
  'unknown',
  'conflicting',
  'expired',
];

export const PUBLISHABLE_STATUSES = ['verified_public', 'client_supplied', 'client_confirmed'];

export const SOURCE_REQUIRED_STATUSES = ['verified_public', 'client_supplied'];

export const CTA_TYPES = [
  'phone',
  'request_service',
  'request_quote',
  'request_estimate',
  'book_consultation',
  'book_inspection',
  'schedule_service',
  'directions',
];

export const PAGE_STATUSES = ['build_now', 'optimize', 'later', 'contact_only', 'do_not_build'];

export const WORKFLOW_STATUSES = [
  'not_started',
  'in_progress',
  'blocked',
  'complete',
  'validated',
  'passed',
  'failed',
  'pending',
];

const SCHEMA_FILES = {
  facts: 'client-facts.schema.json',
  strategy: 'client-strategy.schema.json',
  'site-spec': 'site-spec.schema.json',
  'build-state': 'build-state.schema.json',
};

const SECRET_PATTERNS = [
  /CONTACT_WEBHOOK/i,
  /hooks\.slack\.com/i,
  /webhook\.site/i,
  /sk_live_/,
  /AKIA[0-9A-Z]{16}/,
  /BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/,
  /ghp_[A-Za-z0-9]{20,}/,
  /xox[baprs]-/,
];

const ajv = new Ajv({ allErrors: true, strict: false });
const validators = new Map();

function schemaValidator(kind) {
  if (!validators.has(kind)) {
    const file = SCHEMA_FILES[kind];
    if (!file) throw new Error(`Unknown client file kind: ${kind}`);
    const schema = JSON.parse(fs.readFileSync(path.join(root, 'schemas', file), 'utf8'));
    validators.set(kind, ajv.compile(schema));
  }
  return validators.get(kind);
}

export function repoRoot() {
  return root;
}

export function loadYaml(text) {
  return load(text);
}

export function kindFromFilename(filePath) {
  const base = path.basename(filePath).replace(/\.example\.yaml$/, '').replace(/\.yaml$/, '');
  if (base === 'facts' || base === 'strategy' || base === 'site-spec' || base === 'build-state') return base;
  return '';
}

function formatAjv(errors = []) {
  return errors.map((error) => {
    const where = error.instancePath || '/';
    const allowed = error.params?.allowedValues;
    const suffix = allowed ? ` (${allowed.join(', ')})` : '';
    return `${where} ${error.message}${suffix}`;
  });
}

export function isPublishAttempt(value) {
  if (typeof value === 'boolean') return value === true;
  if (typeof value === 'number') return Number.isFinite(value) && value !== 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return false;
}

export function isPublished(claim) {
  return Boolean(claim) && PUBLISHABLE_STATUSES.includes(claim.status) && isPublishAttempt(claim.value);
}

export function publishedText(claim) {
  if (!isPublished(claim) || typeof claim.value === 'boolean') return '';
  return String(claim.value).trim();
}

function digits(value) {
  return String(value).replace(/\D/g, '');
}

function samePhone(display, tel) {
  const a = digits(display);
  const b = digits(tel);
  return Boolean(a && b && (a.endsWith(b) || b.endsWith(a)));
}

function minutes(clock) {
  const [hour, minute] = clock.split(':').map(Number);
  return hour * 60 + minute;
}

function walkStrings(value, visit) {
  if (typeof value === 'string') visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => walkStrings(item, visit));
}

function secretErrors(data) {
  const errors = [];
  walkStrings(data, (value) => {
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(value)) {
        errors.push('file contains a secret-like value; keep webhook URLs and keys out of client YAML');
        return;
      }
    }
  });
  return errors;
}

function duplicateSlugs(items, label) {
  const seen = new Set();
  const errors = [];
  for (const item of items) {
    if (!item?.slug) continue;
    if (seen.has(item.slug)) errors.push(`${label} slug "${item.slug}" is duplicated`);
    seen.add(item.slug);
  }
  return errors;
}

function claimErrors(claims) {
  const errors = [];
  const withheld = [];
  for (const [name, claim] of Object.entries(claims ?? {})) {
    if (!claim || typeof claim !== 'object') continue;
    const attempt = isPublishAttempt(claim.value);
    if (!attempt && PUBLISHABLE_STATUSES.includes(claim.status)) {
      errors.push(`claims.${name} is ${claim.status} but has no value to publish`);
    }
    if (attempt && !PUBLISHABLE_STATUSES.includes(claim.status)) {
      if (claim.status === 'unknown' || claim.status === 'conflicting') {
        errors.push(`claims.${name} has a value with status ${claim.status}; clear it or set a publishable status`);
      } else {
        withheld.push(`claims.${name} (${claim.status})`);
      }
    }
    if (attempt && SOURCE_REQUIRED_STATUSES.includes(claim.status) && !String(claim.source ?? '').trim()) {
      errors.push(`claims.${name} status ${claim.status} needs a source`);
    }
  }
  return { errors, withheld };
}

function factsErrors(data) {
  const errors = [];
  if (!samePhone(data.contact?.phone_display, data.contact?.phone_tel)) {
    errors.push('contact.phone_display and contact.phone_tel must be the same digits');
  }
  for (const block of data.hours ?? []) {
    if (block.opens && block.closes && minutes(block.opens) >= minutes(block.closes)) {
      errors.push(`hours ${block.opens}–${block.closes} must open before they close`);
    }
    const days = block.days ?? [];
    if (new Set(days).size !== days.length) errors.push('hours days must not repeat inside one block');
  }
  const services = [...(data.services?.primary ?? []), ...(data.services?.offered ?? [])];
  errors.push(...duplicateSlugs(services, 'service'));
  errors.push(...duplicateSlugs(data.service_area?.cities ?? [], 'city'));
  const names = new Set(services.map((service) => service.name));
  if (data.business?.primary_service && !names.has(data.business.primary_service)) {
    errors.push('business.primary_service must match a service name');
  }
  const cityNames = new Set((data.service_area?.cities ?? []).map((city) => city.name));
  if (data.service_area?.primary_city && !cityNames.has(data.service_area.primary_city)) {
    errors.push('service_area.primary_city must match a city name');
  }
  if (data.address?.city && data.service_area?.primary_city && data.address.city !== data.service_area.primary_city) {
    errors.push('address.city and service_area.primary_city must match');
  }
  const claims = claimErrors(data.claims);
  errors.push(...claims.errors);
  errors.push(...secretErrors(data));
  return { errors, withheld: claims.withheld };
}

function pageListErrors(items, label) {
  return duplicateSlugs(items ?? [], label);
}

export function validateClientData(kind, data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: ['document must be a YAML mapping'], withheld: [] };
  }
  const validate = schemaValidator(kind);
  const schemaOk = validate(data);
  const errors = schemaOk ? [] : formatAjv(validate.errors);
  let withheld = [];
  if (schemaOk && kind === 'facts') {
    const extra = factsErrors(data);
    errors.push(...extra.errors);
    withheld = extra.withheld;
  } else if (schemaOk && kind === 'site-spec') {
    errors.push(...pageListErrors(data.pages?.services, 'service page'));
    errors.push(...pageListErrors(data.pages?.service_areas, 'service area'));
    errors.push(...secretErrors(data));
  } else if (schemaOk) {
    errors.push(...secretErrors(data));
  }
  return { ok: errors.length === 0, errors, withheld };
}

export function crossCheck(files) {
  const errors = [];
  const facts = files.facts;
  const spec = files['site-spec'];
  if (!facts || !spec) return errors;
  const serviceSlugs = new Set([
    ...(facts.services?.primary ?? []).map((service) => service.slug),
    ...(facts.services?.offered ?? []).map((service) => service.slug),
  ]);
  const citySlugs = new Set((facts.service_area?.cities ?? []).map((city) => city.slug));
  for (const page of spec.pages?.services ?? []) {
    if (!serviceSlugs.has(page.slug)) errors.push(`site spec service "${page.slug}" is not in facts.yaml`);
  }
  for (const page of spec.pages?.service_areas ?? []) {
    if (!citySlugs.has(page.slug)) errors.push(`site spec city "${page.slug}" is not in facts.yaml`);
  }
  return errors;
}

export function readClientYaml(filePath) {
  return loadYaml(fs.readFileSync(filePath, 'utf8'));
}
