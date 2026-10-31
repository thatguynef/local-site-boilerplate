/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'cloudflare:workers' {
  export const env: {
    CONTACT_WEBHOOK_URL?: string;
  };
}
