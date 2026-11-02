export const CONTACT_FIELD_NAMES = ['service', 'area', 'message', 'preferredTime'];

export function missingContactFields(html) {
  const form = (html.match(/<form\b[\s\S]*?<\/form>/i) ?? [])[0] ?? html;
  const names = new Set([...form.matchAll(/\bname="([^"]*)"/g)].map((match) => match[1]));
  return CONTACT_FIELD_NAMES.filter((name) => !names.has(name));
}
