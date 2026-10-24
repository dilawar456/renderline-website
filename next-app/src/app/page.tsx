import type { Metadata } from 'next';
import { getSiteContent, getPortfolioItems, getPortfolioOrder } from '@/lib/supabase';
import HeroCarousel from '@/components/HeroCarousel';
import PortfolioPreviewSection from '@/components/home/PortfolioPreviewSection';
import ServicesPreviewSection from '@/components/home/ServicesPreviewSection';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: 'RenderLine | Premium Architectural Visualization',
  description: 'RenderLine is a premium architectural visualization studio in Lahore, Pakistan, specializing in photorealistic 3D rendering, interior design, and walkthrough animations.',
};

export const revalidate = 60;

export default async function HomePage() {
  const [contentRes, portfolioRes] = await Promise.all([getSiteContent(), getPortfolioItems()]);
  const content = contentRes.data || {};
  const allItems = portfolioRes.data || [];
  const orderRecord = await getPortfolioOrder(content);
  const order = orderRecord.all || [];

  const sortedItems = [...allItems].sort((a, b) => {
    const iA = order.findIndex(id => String(id) === String(a.id));
    const iB = order.findIndex(id => String(id) === String(b.id));
    if (iA === -1 && iB === -1) return 0;
    if (iA === -1) return 1;
    if (iB === -1) return -1;
    return iA - iB;
  });

  const previewItems = sortedItems.slice(0, 6);
  const heroImages = [1, 2, 3, 4, 5]
    .map(i => content[`cloudinary_hero${i}`] || null)
    .filter(Boolean) as string[];

  return (
    <>
      {/* ============================================================
          HERO — Fixed layout: body flex-col, content + stats
          ============================================================ */}
      <HeroCarousel heroImages={heroImages} content={content} />

      <PortfolioPreviewSection previewItems={previewItems} />
      <ServicesPreviewSection content={content} />
      <CTASection content={content} />
    </>
  );
}
