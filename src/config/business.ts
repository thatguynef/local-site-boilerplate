export type OpeningHours = {
  days: string[];
  opens: string;
  closes: string;
};

export type ServiceLink = {
  name: string;
  href: string;
};

export const business = {
  businessName: 'Example Plumbing',
  schemaType: 'Plumber',
  trade: 'plumbing',
  primaryService: 'Drain cleaning',
  phoneDisplay: '(555) 010-0199',
  phoneTel: '+15550100199',
  email: 'hello@example.com',
  address: {
    street: '100 Main Street',
    city: 'Example City',
    region: 'CA',
    postalCode: '90000',
    country: 'US',
  },
  geo: {
    latitude: 34.0522,
    longitude: -118.2437,
  },
  serviceArea: 'Example City and nearby neighborhoods',
  areaServed: ['Example City', 'North Example', 'Old Town', 'River District'],
  neighborhoods: ['North Example', 'Old Town', 'River District'],
  primaryServices: [
    { name: 'Drain cleaning', href: '/services/drain-cleaning/' },
    { name: 'Water heater repair', href: '/contact/' },
    { name: 'Leak detection', href: '/contact/' },
  ] satisfies ServiceLink[],
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:00',
      closes: '19:00',
    },
  ] satisfies OpeningHours[],
  hoursDisplay: 'Monday–Saturday, 7:00 a.m.–7:00 p.m.',
  responsePromise: 'We call back within one business hour, 7:00 a.m.–7:00 p.m.',
  locale: 'en_US',
  lang: 'en',
  ogImage: '/images/og-default.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  showExampleBanner: true,
  sameAs: [] as string[],
  ownerName: '',
  licenseNumber: '',
  insurance: '',
  guarantee: '',
  reviews: {
    rating: '',
    count: '',
    source: '',
    url: '',
  },
  startingPrice: '',
  analytics: {
    ga4: '',
    gtm: '',
  },
  mainNav: [
    { href: '/', label: 'Home' },
    { href: '/services/', label: 'Services' },
    { href: '/service-areas/', label: 'Service areas' },
    { href: '/about/', label: 'About' },
    { href: '/faq/', label: 'FAQ' },
    { href: '/contact/', label: 'Contact' },
  ],
  footerNav: [
    { href: '/', label: 'Home' },
    { href: '/services/', label: 'Services' },
    { href: '/service-areas/', label: 'Service areas' },
    { href: '/about/', label: 'About' },
    { href: '/faq/', label: 'FAQ' },
    { href: '/contact/', label: 'Contact' },
    { href: '/privacy/', label: 'Privacy' },
  ],
};

export type Business = typeof business;
