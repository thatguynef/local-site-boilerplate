import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublished, publishedText, readClientYaml, repoRoot } from '../lib/client-data.mjs';
import { business } from '../lib/business.mjs';
import { pages } from '../lib/html.mjs';

export function report(label, findings) {
  if (!findings.length) {
    console.log(`PASS ${label}`);
    return 0;
  }
  for (const item of findings) console.log(`FAIL ${item.id}: ${item.evidence}`);
  return 1;
}

export function builtPages() {
  try {
    return pages();
  } catch (error) {
    if (error?.code === 'ENOENT') {
      console.error('Build the site first. These commands read dist/client and are not part of npm run verify.');
      process.exit(1);
    }
    throw error;
  }
}

export function strategyAndFacts() {
  const root = repoRoot();
  const strategyLive = fs.existsSync(path.join(root, 'client/strategy.yaml'));
  const factsLive = fs.existsSync(path.join(root, 'client/facts.yaml'));
  if (strategyLive !== factsLive) {
    throw new Error('client/strategy.yaml and client/facts.yaml must both exist, or neither.');
  }
  const strategyName = strategyLive ? 'strategy.yaml' : 'strategy.example.yaml';
  const factsName = factsLive ? 'facts.yaml' : 'facts.example.yaml';
  return {
    strategy: readClientYaml(path.join(root, 'client', strategyName)),
    facts: readClientYaml(path.join(root, 'client', factsName)),
  };
}

export function conversionInputs(documents) {
  const { strategy, facts } = strategyAndFacts();
  return {
    documents,
    strategy,
    phoneTel: business.phoneTel,
    responseText: publishedText(facts.claims?.response_time),
    financingOffered: Boolean(business.financingStatement),
    emergencyPublished: isPublished(facts.claims?.emergency_service),
  };
}

export function isDirectRun(metaUrl) {
  return Boolean(process.argv[1] && fileURLToPath(metaUrl) === path.resolve(process.argv[1]));
}
