import { digits, pages, writeResult } from '../lib/html.mjs';
import { business } from '../lib/business.mjs';

function samePhone(left, right) {
  const a = digits(String(left ?? ''));
  const b = digits(String(right ?? ''));
  return Boolean(a && b && (a.endsWith(b) || b.endsWith(a)));
}

const documents = pages();
const problems = [];
for (const page of documents) {
  const nap = (page.html.match(/<address\b[^>]*data-nap[\s\S]*?<\/address>/i) ?? [])[0] ?? '';
  if (!nap) {
    problems.push(`${page.url} has no footer NAP`);
    continue;
  }
  const checks = [
    ['data-name', business.businessName],
    ['data-street', business.street],
    ['data-city', business.city],
    ['data-region', business.region],
    ['data-postal', business.postalCode],
  ];
  for (const [name, expected] of checks) {
    const actual = (nap.match(new RegExp(`<[^>]*\\b${name}\\b[^>]*>([^<]*)`)) ?? [])[1]?.trim() ?? '';
    if (actual !== expected) problems.push(`${page.url} ${name} is "${actual}"`);
  }
  const phoneText = (nap.match(/data-phone[^>]*>([^<]*)/) ?? [])[1]?.trim() ?? '';
  const phoneHref = (nap.match(/data-phone[^>]*href="([^"]*)"/) ?? [])[1] ?? '';
  if (!samePhone(phoneText, business.phoneTel) || !samePhone(phoneHref, business.phoneTel)) {
    problems.push(`${page.url} footer phone is "${phoneText}" ${phoneHref}`);
  }
  const headerPhone = (page.html.match(/<a\b[^>]*class="[^"]*header-phone[^"]*"[^>]*>/i) ?? [])[0] ?? '';
  const headerHref = (headerPhone.match(/href="([^"]*)"/) ?? [])[1] ?? '';
  if (!samePhone(headerHref, business.phoneTel)) problems.push(`${page.url} header phone is missing`);
}

const contact = documents.find((page) => page.url === '/contact/');
const contactOk = Boolean(contact)
  && contact.html.includes(business.street)
  && contact.html.includes(business.city)
  && contact.html.includes(`tel:${business.phoneTel}`);

const assertions = [
  {
    id: 'nap-consistent',
    ok: problems.length === 0,
    evidence: problems.length ? problems.join('; ') : `${documents.length} pages share one footer NAP`,
  },
  {
    id: 'RL-CON-01',
    ok: problems.length === 0 && contactOk,
    evidence: problems.length ? problems.join('; ') : `Phone digits match ${business.phoneTel} in the header, footer, and contact page`,
  },
  {
    id: 'RL-CON-02',
    ok: documents.every((page) => /class="[^"]*header-phone[^"]*"/.test(page.html)),
    evidence: 'Every page has a header click-to-call link',
  },
  {
    id: 'GBP-NAP',
    ok: problems.length === 0 && contactOk,
    evidence: `${business.businessName}, ${business.street}, ${business.city} ${business.region} ${business.postalCode}, ${business.phoneDisplay}`,
  },
  {
    id: 'GBP-TEL',
    ok: documents.every((page) => page.html.includes(`href="tel:${business.phoneTel}"`)),
    evidence: `tel:${business.phoneTel} is present on every page`,
  },
];

writeResult('check-nap', assertions);
