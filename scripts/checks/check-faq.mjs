import { readPage, section, strip, headings, writeResult } from '../lib/html.mjs';
import { business } from '../lib/business.mjs';

const faq = readPage('/faq/');
const service = readPage(business.primaryServiceUrl);
const location = readPage(business.primaryCityUrl);
const question = /^(how|what|which|do|where|when|is|can|who)\b/i;

function questions(html) {
  return headings(html).filter((item) => item.text.endsWith('?') || question.test(item.text));
}

function answerText(html) {
  const block = (html.match(/<p\b[^>]*data-answer[^>]*>([\s\S]*?)<\/p>/i) ?? [])[1] ?? '';
  return strip(block);
}

function faqAnswers(html) {
  const block = section(html, 'data-faq');
  return [...block.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => strip(match[1]));
}

const vague = /\bclick here\b|\bsee above\b|\bas mentioned above\b|\bread more\b/i;
const answerPages = [service, location, faq];
const vagueHits = [];
for (const page of answerPages) {
  for (const text of [answerText(page.html), ...faqAnswers(page.html)]) {
    if (vague.test(text)) vagueHits.push(text.slice(0, 80));
  }
}

const faqCount = (section(faq.html, 'data-faq').match(/<h3\b/gi) ?? []).length;
const serviceAnswer = answerText(service.html);
const locationAnswer = answerText(location.html);

const assertions = [
  {
    id: 'faq-count',
    ok: faqCount >= 3,
    evidence: `FAQ page has ${faqCount} questions`,
  },
  {
    id: 'answer-blocks',
    ok: /data-answer/.test(service.html) && /data-faq/.test(service.html) && /data-answer/.test(location.html) && /data-faq/.test(location.html),
    evidence: 'Service and location pages have an answer paragraph and a FAQ section',
  },
  {
    id: 'GEO-ANSWER',
    ok: serviceAnswer.length >= 40
      && locationAnswer.length >= 40
      && serviceAnswer.includes(business.city)
      && locationAnswer.includes(business.city),
    evidence: `Service answer ${serviceAnswer.length} chars; location answer ${locationAnswer.length} chars`,
  },
  {
    id: 'GEO-QUESTION-HEADINGS',
    ok: [service, location, faq].every((page) => questions(page.html).length >= 2),
    evidence: `Question headings: service ${questions(service.html).length}, location ${questions(location.html).length}, FAQ ${questions(faq.html).length}`,
  },
  {
    id: 'GEO-SELF-CONTAINED',
    ok: vagueHits.length === 0 && serviceAnswer.length >= 40,
    evidence: vagueHits.length ? `Vague answers: ${vagueHits.join(' | ')}` : 'Answers do not use "click here", "see above", or "read more"',
  },
  {
    id: 'LV-FAQ',
    ok: faqCount >= 3 && /data-faq/.test(service.html) && /data-faq/.test(location.html),
    evidence: 'FAQ page and service and location pages expose extractable answers',
  },
];

writeResult('check-faq', assertions);
