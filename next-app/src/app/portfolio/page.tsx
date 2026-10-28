import { publicMetadata } from "@/lib/seo";
import type { Metadata } from 'next';
import { getPortfolioItems, getPortfolioOrder, getPinnedItems, getSiteContent, getVideos, optimizeCloudinaryUrl } from '@/lib/public-data';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = publicMetadata({
  alternates: { canonical: "/portfolio" },
    title: 'Portfolio',
    description: 'Explore genuine RenderLine floor-plan studies, front elevations, interiors, exteriors and pre-rendered walkthrough videos.',
});

// Admin saves invalidate cached content; retain a 60-second fallback.
export const revalidate = 60;

export default async function PortfolioPage({searchParams}:{searchParams:Promise<{category?:string}>}) {
    const query=await searchParams;
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
        full_url: optimizeCloudinaryUrl(item.image_url, 1800),
    }));

    return <PortfolioClient items={optimizedItems} videos={videos} order={order} pinned={pinned} initialFilter={query.category} />;
}
