import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SECRET_VALUE = [
  /sk_live_[A-Za-z0-9]+/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  /hooks\.slack\.com\/services\//,
  /webhook\.site\/[A-Za-z0-9-]+/,
  /discord\.com\/api\/webhooks\/\d+/,
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i,
];

const WEBHOOK_ASSIGNMENT = /CONTACT_WEBHOOK_URL\s*[:=]\s*['"]?(https?:\/\/[^\s'"#]+)/g;
const FORM_LOG = /console\.(?:log|info|debug|warn|error)\s*\([^;]*\b(?:lead|formData)\b/;
const HTTP_LINK = /http:\/\/[^\s"'`)<>]+/g;
const HTTP_ALLOWED = /^http:\/\/(?:www\.w3\.org|www\.sitemaps\.org|localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/;
const TEXT = /\.(?:mjs|js|cjs|ts|tsx|astro|json|jsonc|yaml|yml|md|css|html|svg|txt|toml|sh|example)$/i;

export function isForbiddenTrackedFile(rel) {
  const base = rel.split('/').pop();
  if (base === '.env.example' || base === '.dev.vars.example') return false;
  if (base === '.env' || base.startsWith('.env.')) return true;
  if (base === '.dev.vars' || (base.startsWith('.dev.vars.') && base !== '.dev.vars.example')) return true;
  if (/\.(?:pem|p12)$/i.test(base) || /^id_(?:rsa|ed25519|dsa)$/.test(base)) return true;
  if (/^(?:customers|leads|submissions|form-exports)\.(?:csv|json|ndjson|xlsx)$/i.test(base)) return true;
  return false;
}

function webhookHosts(text) {
  const hosts = [];
  for (const match of text.matchAll(new RegExp(WEBHOOK_ASSIGNMENT.source, 'g'))) {
    let url;
    try { url = new URL(match[1]); } catch { url = null; }
    if (!url || url.hostname !== 'example.com') hosts.push(match[1]);
  }
  return hosts;
}

export function securityFindings(files) {
  const findings = [];
  for (const file of files) {
    if (isForbiddenTrackedFile(file.path)) {
      findings.push({
        id: 'secret-file',
        path: file.path,
        evidence: `${file.path} is a secret or a lead export`,
      });
    }
    if (!file.text || file.path.endsWith('.test.mjs')) continue;
    for (const pattern of SECRET_VALUE) {
      if (pattern.test(file.text)) {
        findings.push({
          id: 'secret-value',
          path: file.path,
          evidence: `${file.path} contains a secret-like value`,
        });
        break;
      }
    }
    for (const url of webhookHosts(file.text)) {
      findings.push({
        id: 'webhook-url',
        path: file.path,
        evidence: `${file.path} assigns a webhook URL (${url})`,
      });
    }
    if (FORM_LOG.test(file.text)) {
      findings.push({
        id: 'form-log',
        path: file.path,
        evidence: `${file.path} logs a form value`,
      });
    }
    if (/^(?:src|public)\//.test(file.path)) {
      for (const link of file.text.match(HTTP_LINK) ?? []) {
        if (!HTTP_ALLOWED.test(link)) {
          findings.push({
            id: 'insecure-link',
            path: file.path,
            evidence: `${file.path} links to ${link}`,
          });
        }
      }
    }
  }
  return findings;
}

export function findingsForRepo(root) {
  let listed = '';
  try {
    listed = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
  } catch {
    return [{ id: 'secret-file', path: root, evidence: 'git ls-files failed, so tracked secrets could not be checked' }];
  }
  const files = [];
  for (const rel of listed.split('\0').filter(Boolean)) {
    if (rel.startsWith('node_modules/') || rel.startsWith('dist/')) continue;
    const full = path.join(root, rel);
    let text = '';
    if (TEXT.test(rel) && fs.existsSync(full) && fs.statSync(full).size < 1_000_000) {
      text = fs.readFileSync(full, 'utf8');
    }
    files.push({ path: rel, text });
  }
  return securityFindings(files);
}
