import fs from 'node:fs';
import path from 'node:path';
import { dist, metaContent, pages, readPage, writeResult } from '../lib/html.mjs';
import { business, requiredPages } from '../lib/business.mjs';

const robotsFile = path.join(dist, 'robots.txt');
const robots = fs.existsSync(robotsFile) ? fs.readFileSync(robotsFile, 'utf8') : '';
const sitemapIndex = path.join(dist, 'sitemap-index.xml');
const sitemapFile = path.join(dist, 'sitemap-0.xml');
const sitemap = fs.existsSync(sitemapFile) ? fs.readFileSync(sitemapFile, 'utf8') : '';
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const built = new Set(pages().map((page) => page.url));
const privatePaths = ['/thank-you/', '/404.html'];
const publicRequired = requiredPages.filter((url) => !privatePaths.includes(url));
const missingFromSitemap = publicRequired.filter((url) => !locs.includes(url));
const privateInSitemap = locs.filter((url) => privatePaths.includes(url) || url.includes('/thank-you'));
const unexpected = locs.filter((url) => !built.has(url));

const home = readPage('/');
const missing = readPage('/404.html');
const thanks = readPage('/thank-you/');
const homeRobots = metaContent(home.html, 'robots');
const homeCanonical = (home.html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) ?? [])[0] ?? '';
const canonicalHref = (homeCanonical.match(/href=["']([^"']+)["']/i) ?? [])[1] ?? '';

const assertions = [
  {
    id: 'robots-file',
    ok: /User-agent:\s*\*/i.test(robots) && /Allow:\s*\//i.test(robots) && robots.includes(`${business.site}/sitemap-index.xml`),
    evidence: robots ? robots.replace(/\s+/g, ' ').trim() : 'dist/client/robots.txt is missing',
  },
  {
    id: 'sitemap-file',
    ok: fs.existsSync(sitemapIndex) && fs.existsSync(sitemapFile),
    evidence: `sitemap-index.xml=${fs.existsSync(sitemapIndex)} sitemap-0.xml=${fs.existsSync(sitemapFile)}`,
  },
  {
    id: 'sitemap-public',
    ok: missingFromSitemap.length === 0 && unexpected.length === 0,
    evidence: missingFromSitemap.length || unexpected.length
      ? `Missing ${missingFromSitemap.join(', ') || 'none'}; unexpected ${unexpected.join(', ') || 'none'}`
      : `Sitemap lists ${locs.length} public URLs`,
  },
  {
    id: 'sitemap-omits-private',
    ok: privateInSitemap.length === 0,
    evidence: privateInSitemap.length ? `Private URLs in sitemap: ${privateInSitemap.join(', ')}` : 'Sitemap omits /thank-you/ and /404.html',
  },
  {
    id: 'RL-FND-02',
    ok: /index/i.test(homeRobots)
      && !/noindex/i.test(homeRobots)
      && canonicalHref === `${business.site}/`
      && /noindex/i.test(metaContent(missing.html, 'robots'))
      && /noindex/i.test(metaContent(thanks.html, 'robots')),
    evidence: `Home robots "${homeRobots}", canonical ${canonicalHref || 'missing'}; 404 robots "${metaContent(missing.html, 'robots')}"; thank-you robots "${metaContent(thanks.html, 'robots')}"`,
  },
];

writeResult('check-robots-sitemap', assertions);
