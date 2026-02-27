import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
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

    return (
        <>
            {/* Hero */}
            <section className="portfolio-hero">
                <div className="container">
                    <h1>Our <span>Portfolio</span></h1>
                    <p>A complete collection of 70+ high-end architectural visualizations and walkthrough animations.</p>
                    <div className="filter-buttons">
                        <button className="filter-btn active" data-filter="all">All</button>
                        <button className="filter-btn" data-filter="exterior">Exterior</button>
                        <button className="filter-btn" data-filter="interior">Interior</button>
                        <button className="filter-btn" data-filter="commercial">Commercial</button>
                        <button className="filter-btn" data-filter="floorplan">3D Floorplan</button>
                        <button className="filter-btn" data-filter="animation">Animation</button>
                    </div>
                </div>
            </section>

            {/* Portfolio Grid — Client component handles filtering + lightbox */}
            <PortfolioClient items={optimizedItems} videos={videos} />
        </>
    );
}
