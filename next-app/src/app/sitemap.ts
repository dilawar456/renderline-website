import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only index public destinations; /process redirects to /services.
  return ['', '/about', '/services', '/portfolio', '/contact'].map(route => ({
    url: SITE_URL + route,
    changeFrequency: 'monthly',
    priority: route ? 0.8 : 1,
  }));
}
