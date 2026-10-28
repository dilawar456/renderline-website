import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';
import { SERVICES } from '@/lib/services';
import { getPortfolioItems } from '@/lib/public-data';
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: items } = await getPortfolioItems();
  const routes = ['', '/about', '/services', '/portfolio', '/contact', '/pricing', '/drawing-samples', '/start-project', '/process', ...SERVICES.map(s => '/services/' + s.slug), ...(items || []).map(item => '/portfolio/' + encodeURIComponent(String(item.id)))];
  return [...new Set(routes)].map(route => ({ url: SITE_URL + route, changeFrequency: 'monthly', priority: route ? 0.8 : 1 }));
}
