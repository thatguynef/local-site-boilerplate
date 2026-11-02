import { digits } from './html.mjs';

export function phonesMatch(left, right) {
  const a = digits(String(left ?? ''));
  const b = digits(String(right ?? ''));
  return Boolean(a && b && (a.endsWith(b) || b.endsWith(a)));
}
