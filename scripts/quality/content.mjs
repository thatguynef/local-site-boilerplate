import { section, strip } from '../lib/html.mjs';

const DEPENDENT = [
  /\bclick here\b/i,
  /\bsee above\b/i,
  /\bread more\b/i,
  /\bas mentioned\b/i,
  /\bas stated above\b/i,
];

function mainHtml(html) {
  return html.split(/<main\b[^>]*>/i)[1]?.split(/<\/main>/i)[0] ?? '';
}

function pageKind(url) {
  if (/^\/services\/[^/]+\/$/.test(url)) return 'service';
  if (/^\/service-areas\/[^/]+\/$/.test(url)) return 'area';
  return '';
}

export function contentFindings(documents) {
  const findings = [];
  const answers = { service: new Map(), area: new Map() };

  for (const doc of documents) {
    const text = strip(mainHtml(doc.html));
    for (const pattern of DEPENDENT) {
      if (pattern.test(text)) {
        findings.push({
          id: 'dependent-phrase',
          url: doc.url,
          evidence: `${doc.url} uses a phrase that only makes sense beside other text`,
        });
      }
    }

    const faqAnswers = [...section(doc.html, 'data-faq').matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => strip(match[1]).toLowerCase())
      .filter(Boolean);
    const seen = new Set();
    for (const answer of faqAnswers) {
      if (seen.has(answer)) {
        findings.push({ id: 'duplicate-faq', url: doc.url, evidence: `${doc.url} repeats an FAQ answer` });
        break;
      }
      seen.add(answer);
    }

    const kind = pageKind(doc.url);
    const answer = strip(section(doc.html, 'data-answer')).toLowerCase();
    if (!kind || !answer) continue;
    const prior = answers[kind].get(answer);
    if (prior) {
      findings.push({ id: 'cloned-answer', url: doc.url, evidence: `${doc.url} repeats the answer from ${prior}` });
    } else {
      answers[kind].set(answer, doc.url);
    }
  }

  return findings;
}
