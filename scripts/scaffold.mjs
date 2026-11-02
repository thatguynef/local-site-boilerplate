import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { repoRoot } from './lib/client-data.mjs';
import { sampleLeakHits } from './lib/sample-markers.mjs';
import { loadClientInputs, resolveClientInputs } from './lib/client-files.mjs';
import {
  areaStub,
  pagesToBuild,
  renderBuildState,
  renderBusinessTs,
  serviceStub,
  updateManifest,
  updateSiteOrigin,
  updateWorkerName,
  writeIfChanged,
} from './lib/generate-client.mjs';

function args(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--facts') options.facts = argv[++index];
    else if (token === '--spec') options.spec = argv[++index];
    else throw new Error(`Unknown argument ${token}`);
  }
  return options;
}

const SAMPLE_FILES = [
  ['src/content/services/drain-cleaning.md', 'drain-cleaning', 'services'],
  ['src/content/service-areas/example-city.md', 'example-city', 'service_areas'],
];

function keptSlugs(spec, key) {
  return new Set((spec.pages?.[key] ?? []).map((page) => page.slug));
}

export function scaffoldAt(root, options = {}) {
  const paths = resolveClientInputs(root, options);
  const loaded = loadClientInputs(paths);
  if (loaded.errors.length) return { ok: false, errors: loaded.errors, notes: [] };

  const notes = [];
  const { facts, spec } = loaded;
  const businessPath = path.join(root, 'src/config/business.ts');
  const manifestPath = path.join(root, 'public/site.webmanifest');
  const configPath = path.join(root, 'astro.config.mjs');
  const wranglerPath = path.join(root, 'wrangler.jsonc');

  if (writeIfChanged(businessPath, renderBusinessTs(facts, spec))) notes.push('Wrote src/config/business.ts');
  if (fs.existsSync(manifestPath)) {
    const next = updateManifest(fs.readFileSync(manifestPath, 'utf8'), facts.business.name);
    if (writeIfChanged(manifestPath, next)) notes.push('Wrote public/site.webmanifest');
  }
  if (fs.existsSync(configPath)) {
    const next = updateSiteOrigin(fs.readFileSync(configPath, 'utf8'), spec.project.domain);
    if (writeIfChanged(configPath, next)) notes.push('Updated astro.config.mjs site');
  }
  if (spec.project.worker_name && fs.existsSync(wranglerPath)) {
    const next = updateWorkerName(fs.readFileSync(wranglerPath, 'utf8'), spec.project.worker_name);
    if (writeIfChanged(wranglerPath, next)) notes.push('Updated wrangler.jsonc name');
  }

  const wanted = pagesToBuild(spec);
  const serviceBySlug = new Map(
    [...(facts.services?.primary ?? []), ...(facts.services?.offered ?? [])].map((service) => [service.slug, service]),
  );
  const cityBySlug = new Map((facts.service_area?.cities ?? []).map((city) => [city.slug, city]));

  for (const page of wanted.services) {
    const file = path.join(root, 'src/content/services', `${page.slug}.md`);
    if (file.endsWith('/_example.md') || path.basename(file).startsWith('_')) continue;
    if (fs.existsSync(file)) continue;
    const service = serviceBySlug.get(page.slug);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, serviceStub(service, facts));
    notes.push(`Created ${path.relative(root, file)}`);
  }
  for (const page of wanted.areas) {
    const file = path.join(root, 'src/content/service-areas', `${page.slug}.md`);
    if (path.basename(file).startsWith('_')) continue;
    if (fs.existsSync(file)) continue;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, areaStub(cityBySlug.get(page.slug), facts));
    notes.push(`Created ${path.relative(root, file)}`);
  }

  if (!paths.sample && facts.business.name !== 'Example Plumbing') {
    const keepServices = keptSlugs(spec, 'services');
    const keepAreas = keptSlugs(spec, 'service_areas');
    for (const [relative, slug, key] of SAMPLE_FILES) {
      const keep = key === 'services' ? keepServices : keepAreas;
      if (keep.has(slug)) continue;
      const file = path.join(root, relative);
      if (!fs.existsSync(file)) continue;
      const text = fs.readFileSync(file, 'utf8');
      if (sampleLeakHits(text).length === 0) continue;
      fs.unlinkSync(file);
      notes.push(`Removed sample file ${relative}`);
    }
  }

  const statePath = path.join(root, 'client/build-state.yaml');
  if (!paths.sample && !fs.existsSync(statePath)) {
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, renderBuildState());
    notes.push('Wrote client/build-state.yaml');
  }

  if (notes.length === 0) notes.push('scaffold made no changes');
  if (paths.sample) notes.unshift('Sample checkout. Live client YAML was not written.');
  return { ok: true, errors: [], notes, sample: paths.sample };
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const result = scaffoldAt(repoRoot(), args(process.argv.slice(2)));
  for (const error of result.errors) console.error(`FAIL ${error}`);
  for (const note of result.notes) console.log(note);
  if (!result.ok) process.exit(1);
}
