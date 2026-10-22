import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
 return ['', '/about', '/services', '/portfolio', '/contact', '/process'].map(route => ({url:'https://dilawarali.com'+route, changeFrequency:'monthly', priority:route ? 0.8 : 1}));
}
