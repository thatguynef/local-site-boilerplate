export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  area: string;
  service: string;
  preferredTime: string;
  message: string;
  company: string;
};

const LIMITS: Record<keyof LeadInput, number> = {
  name: 120,
  phone: 40,
  email: 160,
  area: 80,
  service: 80,
  preferredTime: 40,
  message: 4000,
  company: 120,
};

export function readLead(form: FormData): LeadInput {
  const value = (key: keyof LeadInput) => String(form.get(key) ?? '').trim().slice(0, LIMITS[key]);
  return {
    name: value('name'),
    phone: value('phone'),
    email: value('email'),
    area: value('area'),
    service: value('service'),
    preferredTime: value('preferredTime'),
    message: value('message'),
    company: value('company'),
  };
}

export function validateLead(lead: LeadInput, services: string[]): string[] {
  const fields: string[] = [];
  if (!lead.name) fields.push('name');
  const digits = lead.phone.replace(/\D/g, '');
  if (digits.length < 10) fields.push('phone');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) fields.push('email');
  if (!lead.area) fields.push('area');
  if (!lead.service || !services.includes(lead.service)) fields.push('service');
  if (!lead.preferredTime) fields.push('preferredTime');
  return fields;
}
