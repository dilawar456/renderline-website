import type { Metadata } from 'next';
import { getPortfolioItems, getPortfolioOrder, getPinnedItems, getSiteContent, getVideos, optimizeCloudinaryUrl } from '@/lib/supabase';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
    title: 'Portfolio',
    description: 'View our portfolio of 70+ photorealistic architectural renders including exterior, interior, and 3D walkthrough animations.',
};

// Admin saves invalidate cached content; retain a 60-second fallback.
export const revalidate = 60;

export default async function PortfolioPage() {
    const [contentRes, portfolioRes, videosRes] = await Promise.all([
        getSiteContent(),
        getPortfolioItems(),
        getVideos(),
    ]);

    const content = contentRes.data || {};
    const allItems = portfolioRes.data || [];
    const videos = videosRes.data || [];

    const order = await getPortfolioOrder(content);
    const pinned = await getPinnedItems(content);

    // Optimize all image URLs server-side
    const optimizedItems = allItems.map(item => ({
        ...item,
        image_url: optimizeCloudinaryUrl(item.image_url, 800),
        full_url: item.image_url,
    }));

    return <PortfolioClient items={optimizedItems} videos={videos} order={order} pinned={pinned} />;
}
