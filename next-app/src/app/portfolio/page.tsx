import type { Metadata } from 'next';
import { getPortfolioItems, getPortfolioOrder, getSiteContent, getVideos, optimizeCloudinaryUrl } from '@/lib/supabase';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
    title: 'Portfolio',
    description: 'View our portfolio of 70+ photorealistic architectural renders including exterior, interior, and 3D walkthrough animations.',
};

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

    const sortedItems = [...allItems].sort((a, b) => {
        const idxA = order.findIndex(id => String(id) === String(a.id));
        const idxB = order.findIndex(id => String(id) === String(b.id));
        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });

    // Optimize all image URLs server-side
    const optimizedItems = sortedItems.map(item => ({
        ...item,
        image_url: optimizeCloudinaryUrl(item.image_url, 800),
        full_url: item.image_url, // Full quality for lightbox
    }));

    // Fully client-rendered — filter pills + grid + lightbox all in PortfolioClient
    return <PortfolioClient items={optimizedItems} videos={videos} />;
}
