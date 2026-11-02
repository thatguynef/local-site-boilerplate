import fs from 'node:fs';
import path from 'node:path';
import { crossCheck, readClientYaml, validateClientData } from './client-data.mjs';

export function resolveClientInputs(root, options = {}) {
  const factsLive = path.join(root, 'client/facts.yaml');
  const specLive = path.join(root, 'client/site-spec.yaml');
  const factsExample = path.join(root, 'client/facts.example.yaml');
  const specExample = path.join(root, 'client/site-spec.example.yaml');
  const factsPath = options.facts ? path.resolve(options.facts) : null;
  const specPath = options.spec ? path.resolve(options.spec) : null;

  if (factsPath || specPath) {
    if (!factsPath || !specPath) throw new Error('Pass both --facts and --spec, or neither.');
    return { factsPath, specPath, sample: false, explicit: true };
  }
  const liveFacts = fs.existsSync(factsLive);
  const liveSpec = fs.existsSync(specLive);
  if (liveFacts !== liveSpec) {
    throw new Error('client/facts.yaml and client/site-spec.yaml must both exist, or neither.');
  }
  if (liveFacts) return { factsPath: factsLive, specPath: specLive, sample: false, explicit: false };
  return { factsPath: factsExample, specPath: specExample, sample: true, explicit: false };
}

export function loadClientInputs(paths) {
  const facts = readClientYaml(paths.factsPath);
  const spec = readClientYaml(paths.specPath);
  const factsResult = validateClientData('facts', facts);
  const specResult = validateClientData('site-spec', spec);
  const errors = [
    ...factsResult.errors.map((error) => `facts: ${error}`),
    ...specResult.errors.map((error) => `site spec: ${error}`),
    ...crossCheck({ facts, 'site-spec': spec }),
  ];
  return { facts, spec, errors, withheld: factsResult.withheld };
}

export function trackedFile(root, file) {
  return fs.existsSync(path.join(root, file));
}
