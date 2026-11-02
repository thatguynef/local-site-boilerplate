import fs from 'node:fs';
import path from 'node:path';
import { dist, metaContent, pages, writeResult } from '../lib/html.mjs';
import { business } from '../lib/business.mjs';
import { licenseLines } from '../../src/lib/offers.mjs';

const documents = pages();
const cssFiles = [];
function walkCss(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkCss(full);
    else if (entry.name.endsWith('.css')) cssFiles.push(fs.readFileSync(full, 'utf8'));
  }
}
walkCss(dist);
const css = cssFiles.join('\n');

const problems = [];
for (const page of documents) {
  const lang = (page.html.match(/<html\b[^>]*\blang="([^"]*)"/i) ?? [])[1] ?? '';
  if (lang !== 'en') problems.push(`${page.url} lang=${lang || 'missing'}`);
  const mains = page.html.match(/<main\b/gi) ?? [];
  if (mains.length !== 1) problems.push(`${page.url} has ${mains.length} main elements`);
  if (!page.html.includes('href="#main"')) problems.push(`${page.url} has no skip link`);
  if (!/width=device-width/.test(metaContent(page.html, 'viewport'))) problems.push(`${page.url} viewport`);
  const images = [...page.html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  for (const image of images) {
    const alt = image.match(/\balt="([^"]*)"/);
    if (!alt) problems.push(`${page.url} image missing alt`);
  }
  const controls = [...page.html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)].map((match) => match[0]);
  for (const control of controls) {
    const id = (control.match(/\bid="([^"]*)"/) ?? [])[1];
    const aria = /\baria-label=/.test(control);
    if (!id || (!aria && !page.html.includes(`for="${id}"`))) problems.push(`${page.url} unlabeled control`);
  }
}

const iconLinks = ['/favicon.ico', '/favicon.svg', '/favicon-32.png', '/favicon-16.png', '/apple-touch-icon.png', '/site.webmanifest'];
const missingIcons = iconLinks.filter((href) => !fs.existsSync(path.join(dist, href.replace(/^\//, ''))));
const contact = documents.find((page) => page.url === '/contact/');
const thanks = documents.find((page) => page.url === '/thank-you/');
const home = documents.find((page) => page.url === '/');
const tracker = documents.some((page) => /googletagmanager|gtag\(/i.test(page.html));
const analyticsEmpty = business.ga4 === '' && business.gtm === '';

const assertions = [
  {
    id: 'html-a11y',
    ok: problems.length === 0,
    evidence: problems.length ? problems.join('; ') : `${documents.length} pages have lang, one main, a skip link, labeled controls, and image alt text`,
  },
  {
    id: 'a11y-favicons',
    ok: missingIcons.length === 0,
    evidence: missingIcons.length ? `Missing ${missingIcons.join(', ')}` : 'Favicon, apple touch icon, and manifest are built',
  },
  {
    id: 'focus-visible',
    ok: css.includes(':focus-visible') && /outline:\s*3px solid/.test(css),
    evidence: css.includes(':focus-visible') ? 'Built CSS includes a visible focus style' : 'Built CSS has no :focus-visible rule',
  },
  {
    id: 'touch-target',
    ok: /min-height:\s*44px/.test(css),
    evidence: /min-height:\s*44px/.test(css) ? 'Built CSS sets a 44px minimum target' : 'Built CSS has no 44px target',
  },
  {
    id: 'RL-MOB-01',
    ok: documents.every((page) => /width=device-width/.test(metaContent(page.html, 'viewport'))),
    evidence: 'Every page sets a device-width viewport',
  },
  {
    id: 'RL-MOB-02',
    ok: documents.every((page) => page.html.includes('href="#main"') && /width=device-width/.test(metaContent(page.html, 'viewport'))),
    evidence: 'Every page has a skip link and a mobile viewport',
  },
  {
    id: 'RL-MOB-03',
    ok: css.includes(':focus-visible') && /min-height:\s*44px/.test(css),
    evidence: 'Focus styles and 44px targets are in the built stylesheet',
  },
  {
    id: 'RL-RSP-01',
    ok: Boolean(contact && contact.html.includes(business.responsePromise)),
    evidence: contact?.html.includes(business.responsePromise) ? `Contact page states "${business.responsePromise}"` : 'Contact page is missing the response promise',
  },
  {
    id: 'RL-RSP-02',
    ok: Boolean(contact && contact.html.includes(business.hoursDisplay)),
    evidence: `Contact page shows ${business.hoursDisplay}`,
  },
  {
    id: 'RL-RSP-04',
    ok: Boolean(thanks && /What happens next/.test(thanks.html) && thanks.html.includes(`tel:${business.phoneTel}`)),
    evidence: 'Thank-you page tells the visitor what happens next and offers the phone',
  },
  {
    id: 'RL-TRU-04',
    ok: (() => {
      const lines = licenseLines(business.licenseNumber, business.licenses);
      if (!home) return false;
      if (lines.length === 0) return /License:/.test(home.html) && /license number/i.test(home.html);
      return lines.every((line) => home.html.includes(line)) && !/Add the license number/.test(home.html);
    })(),
    evidence: licenseLines(business.licenseNumber, business.licenses).length
      ? `License lines: ${licenseLines(business.licenseNumber, business.licenses).join('; ')}`
      : 'License slot is visible and points at src/config/business.ts until a real number is added',
  },
  {
    id: 'RL-TRU-05',
    ok: Boolean(home && /Guarantee:/.test(home.html) && /guarantee term/i.test(home.html)),
    evidence: 'Guarantee slot is visible and stays empty until a real term is added',
  },
  {
    id: 'RL-MSR-01',
    ok: analyticsEmpty && !tracker,
    evidence: analyticsEmpty && !tracker
      ? 'not_applicable: ga4 and gtm are empty, and the built HTML loads no analytics script'
      : 'Analytics config and the built HTML disagree',
  },
];

writeResult('check-html-a11y', assertions);
