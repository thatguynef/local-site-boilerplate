import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({
  q: z.string().min(8),
  a: z.string().min(20),
});

const step = z.object({
  name: z.string().min(3),
  text: z.string().min(20),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string().optional(),
    answer: z.string().optional(),
    processTitle: z.string().optional(),
    faqs: z.array(faq).optional(),
    steps: z.array(step).optional(),
    noindex: z.boolean().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    answer: z.string().min(40),
    processTitle: z.string(),
    faqs: z.array(faq).min(2),
    steps: z.array(step).min(2),
  }),
});

const serviceAreas = defineCollection({
  loader: glob({ base: './src/content/service-areas', pattern: '[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    city: z.string(),
    neighborhoods: z.array(z.string()).min(1),
    answer: z.string().min(40),
    processTitle: z.string(),
    faqs: z.array(faq).min(2),
    steps: z.array(step).min(2),
  }),
});

export const collections = { pages, services, serviceAreas };
