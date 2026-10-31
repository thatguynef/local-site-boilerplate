import { digits, headings, metaContent, readPage, strip, writeResult } from '../lib/html.mjs';
import { business } from '../lib/business.mjs';

const { html } = readPage('/404.html');
const assertions = [];

assertions.push({
  id: '404-file',
  ok: html.length > 0,
  evidence: html ? 'dist/client/404.html is present' : 'dist/client/404.html is missing',
});

const robots = metaContent(html, 'robots');
assertions.push({
  id: '404-noindex',
  ok: /noindex/i.test(robots) && /nofollow/i.test(robots),
  evidence: robots ? `robots is "${robots}"` : '404 page has no robots meta',
});

const h1s = headings(html).filter((item) => item.level === 1);
assertions.push({
  id: '404-h1',
  ok: h1s.length === 1 && /page not found/i.test(h1s[0].text),
  evidence: h1s.length ? `H1 is "${h1s[0].text}"` : '404 page has no H1',
});

const homeLink = /<a\b[^>]*href=["']\/["'][^>]*>/i.test(html);
assertions.push({
  id: '404-home-link',
  ok: homeLink,
  evidence: homeLink ? '404 page links to /' : '404 page has no home link',
});

const nav = /<nav\b[^>]*aria-label=["']Main["']/i.test(html);
assertions.push({
  id: '404-nav',
  ok: nav,
  evidence: nav ? '404 page includes the main navigation' : '404 page is missing the main navigation',
});

const phone = digits(html).includes(digits(business.phoneDisplay));
assertions.push({
  id: '404-phone',
  ok: phone,
  evidence: phone ? '404 page shows the business phone' : '404 page is missing the business phone',
});

const origin = process.env.VERIFY_ORIGIN;
if (!origin) {
  assertions.push({
    id: '404-runtime',
    ok: false,
    evidence: 'VERIFY_ORIGIN is not set, so the missing-path response was not requested',
  });
} else {
  const response = await fetch(`${origin}/not-a-real-page/`);
  const body = await response.text();
  const ok = response.status === 404 && /noindex/i.test(body) && /page not found/i.test(strip(body));
  assertions.push({
    id: '404-runtime',
    ok,
    evidence: `GET /not-a-real-page/ returned ${response.status}; noindex=${/noindex/i.test(body)}; heading=${/page not found/i.test(strip(body))}`,
  });
}

writeResult('check-404', assertions);
