import { root, writeResult } from '../lib/html.mjs';
import { findingsForRepo } from '../security/scan.mjs';

const findings = findingsForRepo(root);
writeResult('check-security', [
  {
    id: 'security-secrets',
    ok: findings.length === 0,
    evidence: findings.length
      ? findings.slice(0, 8).map((item) => item.evidence).join('; ')
      : 'No tracked secret file, webhook URL, private key, form log, or insecure site link',
  },
]);
