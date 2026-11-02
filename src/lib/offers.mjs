export function licenseLines(licenseNumber, licenses) {
  const lines = [licenseNumber, ...(licenses ?? [])]
    .map((item) => String(item ?? '').trim())
    .filter(Boolean);
  return [...new Set(lines)];
}

export function financingOffer(financing) {
  const statement = String(financing?.statement ?? '').trim();
  const url = String(financing?.url ?? '').trim();
  if (!statement || !url) return null;
  return { statement, url };
}

export function maintenanceStatement(plan, slug, title) {
  const text = String(plan ?? '').trim();
  if (!text) return '';
  if (!/maintenance/i.test(String(slug ?? '')) && !/maintenance/i.test(String(title ?? ''))) return '';
  return text;
}
