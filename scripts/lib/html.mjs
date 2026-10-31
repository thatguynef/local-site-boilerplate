import fs from 'node:fs';
import path from 'node:path';

export const root = path.resolve(import.meta.dirname, '../..');
export const dist = path.join(root, 'dist/client');

export function strip(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function walkHtml(dir = dist) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

export function pageUrl(file) {
  const rel = path.relative(dist, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

export function pages() {
  return walkHtml()
    .map((file) => ({ file, url: pageUrl(file), html: fs.readFileSync(file, 'utf8') }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

export function readPage(urlPath) {
  const file = urlPath === '/404.html'
    ? path.join(dist, '404.html')
    : urlPath === '/'
      ? path.join(dist, 'index.html')
      : path.join(dist, urlPath.replace(/^\//, ''), 'index.html');
  return { file, html: fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '' };
}

export function tagAttr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return match ? (match[2] ?? match[3] ?? '') : '';
}

export function metas(html) {
  const found = [];
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = (tagAttr(tag, 'name') || tagAttr(tag, 'property') || tagAttr(tag, 'charset') && 'charset').toLowerCase();
    const content = tagAttr(tag, 'content') || (tagAttr(tag, 'charset') ? tagAttr(tag, 'charset') : '');
    if (/\bcharset\s*=/.test(tag) && !tagAttr(tag, 'charset')) {
      found.push({ name: 'charset', content: 'utf-8' });
    }
    if (name) found.push({ name, content });
  }
  return found;
}

export function metaContent(html, name) {
  return metas(html).find((item) => item.name === name.toLowerCase())?.content ?? '';
}

export function links(html) {
  return (html.match(/<link\b[^>]*>/gi) ?? []).map((tag) => ({
    rel: tagAttr(tag, 'rel').toLowerCase(),
    href: tagAttr(tag, 'href'),
  }));
}

export function headings(html) {
  return [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: strip(match[2]),
  }));
}

export function jsonLd(html) {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .flatMap((block) => block['@graph'] ?? [block]);
}

export function section(html, attr) {
  const match = html.match(new RegExp(`<([a-z0-9]+)[^>]*\\b${attr}\\b[^>]*>([\\s\\S]*?)<\\/\\1>`, 'i'));
  return match ? match[2] : '';
}

export function digits(value) {
  return value.replace(/\D/g, '');
}

export function writeResult(name, assertions) {
  const dir = path.join(root, 'evaluations/results');
  fs.mkdirSync(dir, { recursive: true });
  const ok = assertions.every((item) => item.ok);
  fs.writeFileSync(
    path.join(dir, `${name}.json`),
    JSON.stringify({ name, ok, assertions }, null, 2),
  );
  for (const item of assertions) {
    console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.id}: ${item.evidence}`);
  }
  if (!ok) process.exitCode = 1;
}
