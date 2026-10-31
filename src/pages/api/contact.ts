import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { business } from '../../config/business';
import { readLead, validateLead } from '../../lib/lead';

export const prerender = false;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const lead = readLead(form);
  if (lead.company) {
    return redirect('/thank-you/', 303);
  }

  const services = business.primaryServices.map((service) => service.name);
  const fields = validateLead(lead, services);
  if (fields.length > 0) {
    return json({ ok: false, fields }, 400);
  }

  const webhook = env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        area: lead.area,
        service: lead.service,
        preferredTime: lead.preferredTime,
        message: lead.message,
        source: 'website-contact-form',
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return new Response(
        `We could not send your request. Call ${business.phoneDisplay}.`,
        { status: 502, headers: { 'content-type': 'text/plain; charset=utf-8' } },
      );
    }
  }

  return redirect('/thank-you/', 303);
};

export const GET: APIRoute = () => new Response(null, { status: 405 });
