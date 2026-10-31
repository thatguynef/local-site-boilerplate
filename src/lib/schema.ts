import { business } from '../config/business';

export type Crumb = { name: string; href: string };
export type Faq = { q: string; a: string };
export type Step = { name: string; text: string };

type GraphOptions = {
  pageUrl: string;
  description: string;
  crumbs?: Crumb[];
  faqs?: Faq[];
  steps?: Step[];
  processTitle?: string;
  serviceName?: string;
};

function abs(href: string, origin: string) {
  return new URL(href, origin).href;
}

export function buildGraph(options: GraphOptions) {
  const origin = new URL(options.pageUrl).origin + '/';
  const businessId = new URL('#business', origin).href;
  const websiteId = new URL('#website', origin).href;
  const image = new URL(business.ogImage, origin).href;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: business.businessName,
      url: origin,
      inLanguage: business.lang,
    },
    {
      '@type': business.schemaType,
      '@id': businessId,
      name: business.businessName,
      url: origin,
      telephone: business.phoneTel,
      email: business.email,
      image,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.street,
        addressLocality: business.address.city,
        addressRegion: business.address.region,
        postalCode: business.address.postalCode,
        addressCountry: business.address.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
      openingHoursSpecification: business.openingHours.map((hours) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.days,
        opens: hours.opens,
        closes: hours.closes,
      })),
      areaServed: business.areaServed.map((name) => ({
        '@type': 'City',
        name,
      })),
      ...(business.sameAs.length ? { sameAs: business.sameAs } : {}),
    },
  ];

  if (options.crumbs && options.crumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${options.pageUrl}#breadcrumb`,
      itemListElement: options.crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: abs(crumb.href, origin),
      })),
    });
  }

  if (options.serviceName) {
    graph.push({
      '@type': 'Service',
      '@id': `${options.pageUrl}#service`,
      name: options.serviceName,
      serviceType: options.serviceName,
      description: options.description,
      url: options.pageUrl,
      provider: { '@id': businessId },
      areaServed: business.areaServed.map((name) => ({ '@type': 'City', name })),
    });
  }

  if (options.faqs && options.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${options.pageUrl}#faq`,
      mainEntity: options.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    });
  }

  if (options.steps && options.steps.length > 0) {
    graph.push({
      '@type': 'HowTo',
      '@id': `${options.pageUrl}#howto`,
      name: options.processTitle || 'How it works',
      step: options.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
