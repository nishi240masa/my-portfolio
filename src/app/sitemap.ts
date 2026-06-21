import type { MetadataRoute } from 'next';
import { productionRepo } from '@/lib/repositories/sync';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
  const staticRoutes = ['/home', '/profile', '/skill', '/production'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  const productions = await productionRepo.list().catch(() => []);
  const productionRoutes = productions.map((p) => ({
    url: `${base}/production/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...productionRoutes];
}
