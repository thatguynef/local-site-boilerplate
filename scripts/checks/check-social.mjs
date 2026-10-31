import fs from 'node:fs';
import path from 'node:path';
import { dist, metaContent, pages, writeResult } from '../lib/html.mjs';

const ogNames = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale'];
const twitterNames = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
const documents = pages();
const missing = [];

for (const page of documents) {
  for (const name of [...ogNames, ...twitterNames]) {
    if (!metaContent(page.html, name)) missing.push(`${page.url} ${name}`);
  }
  if (metaContent(page.html, 'og:type') !== 'website') missing.push(`${page.url} og:type`);
  if (metaContent(page.html, 'twitter:card') !== 'summary_large_image') missing.push(`${page.url} twitter:card`);
}

const assertions = [
  {
    id: 'social-tags',
    ok: documents.length > 0 && missing.length === 0,
    evidence: missing.length ? `Missing ${missing.join(', ')}` : `${documents.length} HTML files include Open Graph and Twitter Card tags`,
  },
];

const imageMeta = metaContent(documents.find((page) => page.url === '/')?.html ?? '', 'og:image');
const imagePath = imageMeta ? new URL(imageMeta).pathname : '';
const imageFile = imagePath ? path.join(dist, imagePath) : '';
const exists = imageFile && fs.existsSync(imageFile);
let size = '';
let dimensionsOk = false;
if (exists) {
  const bytes = fs.readFileSync(imageFile);
  const png = bytes.length > 24 && bytes.toString('ascii', 1, 4) === 'PNG';
  const width = png ? bytes.readUInt32BE(16) : 0;
  const height = png ? bytes.readUInt32BE(20) : 0;
  size = `${width}x${height}`;
  dimensionsOk = width === 1200 && height === 630;
}

assertions.push({
  id: 'og-image-file',
  ok: exists,
  evidence: exists ? `Share image file is ${imagePath}` : `Share image is missing (${imageMeta || 'no og:image'})`,
});
assertions.push({
  id: 'og-image-size',
  ok: dimensionsOk,
  evidence: exists ? `Share image is ${size}` : 'Share image could not be measured',
});

writeResult('check-social', assertions);
