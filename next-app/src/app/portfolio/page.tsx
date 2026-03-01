import type { Metadata } from 'next';
import { getPortfolioItems, getPortfolioOrder, getPinnedItems, getSiteContent, getVideos, optimizeCloudinaryUrl } from '@/lib/supabase';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
    title: 'Portfolio',
    description: 'View our portfolio of 70+ photorealistic architectural renders including exterior, interior, and 3D walkthrough animations.',
};

// Reduced to 5s so order/pin changes show up almost instantly after revalidation
export const revalidate = 5;

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

    // Sort: pinned first (in pin order), then rest by saved order
    const sortedItems = [...allItems].sort((a, b) => {
        const aIdStr = String(a.id);
        const bIdStr = String(b.id);

        const aPinned = pinned.findIndex(id => String(id) === aIdStr);
        const bPinned = pinned.findIndex(id => String(id) === bIdStr);

        // Both pinned — sort by pin order
        if (aPinned !== -1 && bPinned !== -1) return aPinned - bPinned;
        // Only A pinned — A goes first
        if (aPinned !== -1) return -1;
        // Only B pinned — B goes first
        if (bPinned !== -1) return 1;

        // Neither pinned — sort by saved order
        const idxA = order.findIndex(id => String(id) === aIdStr);
        const idxB = order.findIndex(id => String(id) === bIdStr);
        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });

    // Optimize all image URLs server-side
    const optimizedItems = sortedItems.map(item => ({
        ...item,
        image_url: optimizeCloudinaryUrl(item.image_url, 800),
        full_url: item.image_url,
        is_pinned: pinned.some(id => String(id) === String(item.id)),
    }));

    return <PortfolioClient items={optimizedItems} videos={videos} />;
}
