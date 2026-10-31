import { readPage, writeResult } from '../lib/html.mjs';

const { html } = readPage('/contact/');
const form = (html.match(/<form\b[\s\S]*?<\/form>/i) ?? [])[0] ?? '';
const controls = [...form.matchAll(/<(input|select|textarea)\b[^>]*>/gi)].map((match) => match[0]);
const fields = controls.map((tag) => ({
  tag,
  name: (tag.match(/\bname="([^"]*)"/) ?? [])[1] ?? '',
  type: (tag.match(/\btype="([^"]*)"/) ?? [])[1] ?? '',
  id: (tag.match(/\bid="([^"]*)"/) ?? [])[1] ?? '',
  required: /\brequired\b/.test(tag),
}));
const required = fields.filter((field) => field.required && field.name !== 'company');
const labelsOk = fields.every((field) => field.id && form.includes(`for="${field.id}"`));
const honeypot = fields.find((field) => field.name === 'company');
const honeypotHidden = /class="hp"[^>]*aria-hidden="true"[\s\S]*name="company"[\s\S]*tabindex="-1"/.test(form);

function optionValues(name) {
  const block = (form.match(new RegExp(`<select\\b[^>]*name="${name}"[\\s\\S]*?<\\/select>`, 'i')) ?? [])[0] ?? '';
  return [...block.matchAll(/<option\b[^>]*value="([^"]+)"/g)].map((match) => match[1]);
}

const assertions = [
  {
    id: 'RL-CON-04',
    ok: /method="post"/i.test(form) && /action="\/api\/contact\/"/.test(form),
    evidence: form ? 'Contact page posts to /api/contact/' : 'Contact page has no form',
  },
  {
    id: 'RL-CON-05',
    ok: required.length > 0 && required.length <= 6,
    evidence: `${required.length} required fields (${required.map((field) => field.name).join(', ')}). Full Website Scorecard points prefer 5 or fewer; ZIP is kept because the form also records where the job is.`,
  },
  {
    id: 'RL-CON-06',
    ok: labelsOk
      && fields.some((field) => field.name === 'phone' && field.type === 'tel')
      && fields.some((field) => field.name === 'email' && field.type === 'email'),
    evidence: labelsOk ? 'Each control has a label; phone is tel and email is email' : 'A control is missing its label or expected type',
  },
  {
    id: 'RL-RSP-05',
    ok: ['service', 'area', 'message', 'preferredTime'].every((name) => fields.some((field) => field.name === name)),
    evidence: 'Form includes service, area, message, and preferred contact time',
  },
  {
    id: 'form-honeypot',
    ok: Boolean(honeypot) && honeypotHidden && !honeypot.required,
    evidence: honeypot ? 'Honeypot company field is off-screen, aria-hidden, and not required' : 'Honeypot is missing',
  },
];

const origin = process.env.VERIFY_ORIGIN;
if (!origin) {
  for (const id of ['form-invalid', 'form-valid', 'form-honeypot-runtime', 'form-get']) {
    assertions.push({ id, ok: false, evidence: 'VERIFY_ORIGIN is not set' });
  }
} else {
  const secret = 'SECRET-VALUE-XYZ';
  const invalid = await fetch(`${origin}/api/contact/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ message: secret }).toString(),
    redirect: 'manual',
  });
  const invalidBody = await invalid.text();
  let invalidJson = null;
  try { invalidJson = JSON.parse(invalidBody); } catch { invalidJson = null; }
  const invalidOk = invalid.status === 400
    && invalidJson?.ok === false
    && Array.isArray(invalidJson.fields)
    && ['name', 'phone', 'email', 'area', 'service', 'preferredTime'].every((name) => invalidJson.fields.includes(name))
    && !invalidBody.includes(secret)
    && !invalid.headers.get('location');
  assertions.push({
    id: 'form-invalid',
    ok: invalidOk,
    evidence: `Invalid POST returned ${invalid.status} ${invalidBody.slice(0, 180)}`,
  });

  const service = optionValues('service')[0];
  const time = optionValues('preferredTime')[0];
  const validBody = new URLSearchParams({
    name: 'Ada Example',
    phone: '5550100199',
    email: 'ada@example.com',
    area: '90000',
    service,
    preferredTime: time,
    message: 'Kitchen sink is slow.',
  });
  const valid = await fetch(`${origin}/api/contact/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: validBody.toString(),
    redirect: 'manual',
  });
  const location = valid.headers.get('location') ?? '';
  let locationUrl = null;
  try { locationUrl = new URL(location, origin); } catch { locationUrl = null; }
  const validOk = valid.status === 303
    && locationUrl?.pathname === '/thank-you/'
    && !locationUrl.search
    && !location.includes('ada@example.com')
    && !location.includes('Kitchen');
  assertions.push({
    id: 'form-valid',
    ok: validOk,
    evidence: `Valid POST returned ${valid.status} Location ${location || 'missing'}. Webhook is unset, so nothing is stored.`,
  });

  const trapped = await fetch(`${origin}/api/contact/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ company: 'bot' }).toString(),
    redirect: 'manual',
  });
  const trappedLocation = trapped.headers.get('location') ?? '';
  assertions.push({
    id: 'form-honeypot-runtime',
    ok: trapped.status === 303 && trappedLocation.includes('/thank-you/'),
    evidence: `Honeypot POST returned ${trapped.status} Location ${trappedLocation || 'missing'}`,
  });

  const get = await fetch(`${origin}/api/contact/`, { method: 'GET', redirect: 'manual' });
  assertions.push({
    id: 'form-get',
    ok: get.status === 405,
    evidence: `GET /api/contact/ returned ${get.status}`,
  });
}

writeResult('check-form', assertions);
