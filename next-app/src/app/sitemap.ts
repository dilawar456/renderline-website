import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';
import {SERVICES} from '@/lib/services';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only index public destinations.
  return ['', '/about', '/services', '/portfolio', '/contact', '/pricing', '/drawing-samples', '/start-project', '/process', ...SERVICES.map(s=>'/services/'+s.slug)].map(route => ({
    url: SITE_URL + route,
    changeFrequency: 'monthly',
    priority: route ? 0.8 : 1,
  }));
}
