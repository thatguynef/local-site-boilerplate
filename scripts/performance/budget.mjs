export const DEFAULT_BUDGET = {
  max_client_js_kb: 60,
  max_css_kb: 120,
  max_hero_image_kb: 300,
  max_homepage_image_kb: 1200,
  external_fonts: false,
  decorative_video_hero: false,
};

const FONT_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'use.typekit.net',
  'fast.fonts.net',
  'fonts.cdnfonts.com',
  'api.fontshare.com',
];

function kb(bytes) {
  return Math.ceil(bytes / 1024);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return match ? (match[2] ?? match[3] ?? '') : '';
}

function images(html) {
  const found = [];
  for (const tag of html.match(/<(?:img|source)\b[^>]*>/gi) ?? []) {
    const priority = /fetchpriority=["']high["']/i.test(tag) || attr(tag, 'loading').toLowerCase() === 'eager';
    const lazy = attr(tag, 'loading').toLowerCase() === 'lazy';
    const sources = attr(tag, 'srcset')
      ? attr(tag, 'srcset').split(',').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean)
      : [attr(tag, 'src')].filter(Boolean);
    for (const src of sources) found.push({ src, priority, lazy, img: tag.startsWith('<img') || tag.startsWith('<IMG') });
  }
  return found;
}

function fileBytes(files, src) {
  if (!src || /^(?:https?:|data:|\/\/)/.test(src)) return undefined;
  const rel = src.replace(/^\//, '').split('?')[0];
  return files.find((file) => file.path === rel)?.bytes;
}

export function budgetFromSpec(spec) {
  const raw = spec?.performance ?? {};
  const budget = { ...DEFAULT_BUDGET };
  for (const key of Object.keys(DEFAULT_BUDGET)) {
    if (raw[key] !== undefined) budget[key] = raw[key];
  }
  return budget;
}

export function performanceFindings({ documents, files, css = '', budget = DEFAULT_BUDGET }) {
  const findings = [];
  const jsBytes = files
    .filter((file) => file.path.endsWith('.js') && !file.path.endsWith('.js.map'))
    .reduce((sum, file) => sum + file.bytes, 0);
  const cssBytes = files
    .filter((file) => file.path.endsWith('.css'))
    .reduce((sum, file) => sum + file.bytes, 0);
  if (kb(jsBytes) > budget.max_client_js_kb) {
    findings.push({
      id: 'client-js',
      evidence: `client JavaScript is ${kb(jsBytes)} KB and the budget is ${budget.max_client_js_kb} KB`,
    });
  }
  if (kb(cssBytes) > budget.max_css_kb) {
    findings.push({
      id: 'css',
      evidence: `CSS is ${kb(cssBytes)} KB and the budget is ${budget.max_css_kb} KB`,
    });
  }

  const style = `${css}\n${documents.map((doc) => doc.html).join('\n')}`.toLowerCase();
  if (!budget.external_fonts) {
    const host = FONT_HOSTS.find((item) => style.includes(item));
    if (host) findings.push({ id: 'external-font', evidence: `stylesheet or page loads ${host}` });
  }

  const home = documents.find((doc) => doc.url === '/');
  if (home && !budget.decorative_video_hero && /<video\b/i.test(home.html)) {
    findings.push({ id: 'video-hero', evidence: 'the homepage includes a video' });
  }

  const seen = new Set();
  let homeBytes = 0;
  for (const image of images(home?.html ?? '')) {
    if (seen.has(image.src)) continue;
    seen.add(image.src);
    const bytes = fileBytes(files, image.src);
    if (bytes === undefined && /^(?:https?:|\/\/)/.test(image.src)) {
      findings.push({ id: 'external-image', evidence: `homepage image is remote (${image.src})` });
      continue;
    }
    if (bytes === undefined) {
      findings.push({ id: 'missing-image', evidence: `homepage image ${image.src} is not in the build` });
      continue;
    }
    homeBytes += bytes;
    if (image.priority && kb(bytes) > budget.max_hero_image_kb) {
      findings.push({
        id: 'hero-image',
        evidence: `${image.src} is ${kb(bytes)} KB and the priority-image budget is ${budget.max_hero_image_kb} KB`,
      });
    }
  }
  if (kb(homeBytes) > budget.max_homepage_image_kb) {
    findings.push({
      id: 'homepage-images',
      evidence: `homepage images are ${kb(homeBytes)} KB and the budget is ${budget.max_homepage_image_kb} KB`,
    });
  }

  for (const doc of documents) {
    const pics = images(doc.html).filter((image) => image.img);
    const priority = pics.filter((image) => image.priority);
    if (priority.length > 1) {
      findings.push({ id: 'eager-image', evidence: `${doc.url} has ${priority.length} high-priority images` });
    }
    for (const image of pics) {
      if (!image.priority && !image.lazy) {
        findings.push({ id: 'image-loading', evidence: `${doc.url} image ${image.src} is not lazy` });
      }
    }
  }

  return findings;
}
