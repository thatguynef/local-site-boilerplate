import { strip } from '../lib/html.mjs';

const FORM_TYPES = new Set([
  'request_service',
  'request_quote',
  'request_estimate',
  'book_consultation',
  'book_inspection',
  'schedule_service',
]);

function mainText(html) {
  return strip(html.split(/<main\b[^>]*>/i)[1]?.split(/<\/main>/i)[0] ?? '');
}

function mentions(text, phrase) {
  const escaped = String(phrase).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!escaped) return false;
  return new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, 'i').test(text);
}

function hasTel(html, phoneTel) {
  return html.includes(`tel:${phoneTel}`);
}

function hasContact(html) {
  return /href=["']\/contact\/["']/.test(html);
}

export function conversionFindings({
  documents,
  strategy,
  phoneTel,
  responseText,
  financingOffered,
  emergencyPublished,
}) {
  const findings = [];
  const byUrl = new Map(documents.map((doc) => [doc.url, doc]));
  const primary = strategy?.conversion?.primary?.type;
  const secondary = strategy?.conversion?.secondary?.type;
  const watched = documents.filter((doc) => doc.url === '/' || /^\/services\/[^/]+\/$/.test(doc.url));

  function requireAction(doc, type, role) {
    if (!doc || !type || type === 'directions') return;
    if (type === 'phone' && !hasTel(doc.html, phoneTel)) {
      findings.push({
        id: 'cta-phone',
        url: doc.url,
        evidence: `${doc.url} lists a phone ${role} action and has no tel link`,
      });
    }
    if (FORM_TYPES.has(type) && !hasContact(doc.html)) {
      findings.push({
        id: 'cta-form',
        url: doc.url,
        evidence: `${doc.url} lists a form ${role} action and has no /contact/ link`,
      });
    }
  }

  for (const doc of watched) {
    requireAction(doc, primary, 'primary');
    requireAction(doc, secondary, 'secondary');
  }

  if (strategy?.conversion?.response_expectation?.enabled) {
    if (!responseText) {
      findings.push({
        id: 'response-claim',
        url: '/contact/',
        evidence: 'response expectation is enabled without a publishable response_time claim',
      });
    } else {
      for (const url of ['/contact/', '/thank-you/']) {
        const doc = byUrl.get(url);
        if (!doc || !doc.html.includes(responseText)) {
          findings.push({
            id: 'response-text',
            url,
            evidence: `${url} does not show the publishable response promise`,
          });
        }
      }
    }
  }

  if (strategy?.conversion?.emergency?.prioritize_phone && !emergencyPublished) {
    findings.push({
      id: 'emergency-claim',
      url: '/',
      evidence: 'emergency phone treatment is on without a publishable emergency_service claim',
    });
  }

  if (!financingOffered) {
    for (const doc of documents) {
      if (doc.html.includes('data-financing')) {
        findings.push({
          id: 'financing',
          url: doc.url,
          evidence: `${doc.url} shows financing without a statement`,
        });
      }
    }
  }

  const avoidPages = documents.filter((doc) => (
    doc.url === '/'
    || doc.url === '/contact/'
    || /^\/services\/[^/]+\/$/.test(doc.url)
    || /^\/service-areas\/[^/]+\/$/.test(doc.url)
  ));
  for (const phrase of strategy?.positioning?.avoid_positioning ?? []) {
    for (const doc of avoidPages) {
      if (mentions(mainText(doc.html), phrase)) {
        findings.push({
          id: 'avoid-positioning',
          url: doc.url,
          evidence: `${doc.url} says "${phrase}", which the strategy says to avoid`,
        });
      }
    }
  }

  return findings;
}
