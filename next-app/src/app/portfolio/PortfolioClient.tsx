'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface PortfolioItem {
    id: string | number;
    title: string;
    image_url: string;
    full_url: string;
    category?: string;
    is_pinned?: boolean;
}

interface Video {
    id: string;
    title?: string;
    video_url: string;
}

interface Props {
    items: PortfolioItem[];
    videos: Video[];
    order: Record<string, string[]>;
    pinned: Record<string, string[]>;
}

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'exterior', label: 'Exterior' },
    { key: 'interior', label: 'Interior' },
    { key: 'commercial', label: 'Commercial' },
    { key: 'floorplan', label: '3D Floorplan' },
    { key: 'animation', label: 'Animation' },
];

function getYouTubeId(url: string) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s?]+)/);
    return match ? match[1] : null;
}

export default function PortfolioClient({ items, videos, order, pinned }: Props) {
    const [filter, setFilter] = useState('all');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Derive what to show from filter alone
    const showVideos = filter === 'animation';

    // Get current category's arrays
    const currentOrder = order[filter] || [];
    const currentPinned = pinned[filter] || [];

    // Filter items based on category
    let displayItems = filter === 'all'
        ? items
        : filter === 'animation'
            ? []
            : items.filter(i => i.category === filter);

    // Apply sorting based on current category order
    if (!showVideos && displayItems.length > 0) {
        displayItems = [...displayItems].sort((a, b) => {
            const aIdStr = String(a.id);
            const bIdStr = String(b.id);

            const aPinned = currentPinned.findIndex(id => String(id) === aIdStr);
            const bPinned = currentPinned.findIndex(id => String(id) === bIdStr);

            if (aPinned !== -1 && bPinned !== -1) return aPinned - bPinned;
            if (aPinned !== -1) return -1;
            if (bPinned !== -1) return 1;

            const idxA = currentOrder.findIndex(id => String(id) === aIdStr);
            const idxB = currentOrder.findIndex(id => String(id) === bIdStr);

            if (idxA === -1 && idxB === -1) return 0;
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
            return idxA - idxB;
        }).map(item => ({
            ...item,
            is_pinned: currentPinned.some(id => String(id) === String(item.id))
        }));
    }

    const handleFilter = useCallback((key: string) => {
        setFilter(key);
        setLightboxIndex(null);
    }, []);

    const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);

    const prevImage = useCallback(() => {
        setLightboxIndex(i => i !== null ? (i - 1 + displayItems.length) % displayItems.length : 0);
    }, [displayItems.length]);

    const nextImage = useCallback(() => {
        setLightboxIndex(i => i !== null ? (i + 1) % displayItems.length : 0);
    }, [displayItems.length]);

    // Close lightbox on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [closeLightbox, prevImage, nextImage]);

    return (
        <>
            {/* ============================
                FILTER PILLS — All in client
                ============================ */}
            <section className="portfolio-hero">
                <div className="container">
                    <h1>Our <span>Portfolio</span></h1>
                    <p>A complete collection of 70+ high-end architectural visualizations and walkthrough animations.</p>

                    <div className="filter-pills">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                className={`filter-btn${filter === f.key ? ' active' : ''}`}
                                onClick={() => handleFilter(f.key)}
                                type="button"
                            >
                                {f.label}
                                {f.key !== 'all' && f.key !== 'animation' && (
                                    <span style={{
                                        marginLeft: '5px',
                                        fontSize: '0.65rem',
                                        opacity: 0.6,
                                        fontWeight: 400,
                                    }}>
                                        ({items.filter(i => i.category === f.key).length})
                                    </span>
                                )}
                                {f.key === 'animation' && (
                                    <span style={{ marginLeft: '5px', fontSize: '0.65rem', opacity: 0.6 }}>
                                        ({videos.length})
                                    </span>
                                )}
                                {f.key === 'all' && (
                                    <span style={{ marginLeft: '5px', fontSize: '0.65rem', opacity: 0.6 }}>
                                        ({items.length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================
                IMAGES GRID
                ============================ */}
            {!showVideos && (
                <section className="portfolio-grid-section" id="portfolioSection">
                    {displayItems.length > 0 ? (
                        <div className="portfolio-grid">
                            {displayItems.map((item, idx) => (
                                <div
                                    key={item.id}
                                    className={`portfolio-item${item.is_pinned ? ' pinned' : ''}`}
                                    onClick={() => openLightbox(idx)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && openLightbox(idx)}
                                >
                                    {item.is_pinned && (
                                        <div className="pin-badge" title="Featured">📌</div>
                                    )}
                                    <Image
                                        src={item.image_url}
                                        alt={item.title || 'Project'}
                                        width={600}
                                        height={400}
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '5rem 1rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                        }}>
                            No items found in this category.
                        </div>
                    )}
                </section>
            )}

            {/* ============================
                ANIMATION / VIDEO SECTION
                ============================ */}
            {showVideos && (
                <section className="video-section">
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <span className="section-label">Cinematic Work</span>
                            <h2 className="section-title">
                                3D Walkthroughs &amp; <span>Animations</span>
                            </h2>
                            <div className="gold-line" />
                            <p className="section-desc">
                                Cinematic architectural animations for real estate marketing.
                            </p>
                        </div>

                        {videos.length > 0 ? (
                            <div className="video-grid">
                                {videos.map(vid => {
                                    const ytId = getYouTubeId(vid.video_url);
                                    return (
                                        <a
                                            key={vid.id}
                                            href={vid.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="video-card"
                                        >
                                            <div className="video-thumb">
                                                {ytId && (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                                                        alt={vid.title || 'Video'}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        loading="lazy"
                                                    />
                                                )}
                                                <div className="play-overlay">
                                                    <div className="play-btn" />
                                                </div>
                                            </div>
                                            <div className="video-info">
                                                <h4>{vid.title || 'Walkthrough Animation'}</h4>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '4rem 1rem',
                                color: 'var(--text-muted)',
                            }}>
                                No videos added yet. Add videos from the admin panel.
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ============================
                LIGHTBOX
                ============================ */}
            {lightboxIndex !== null && displayItems[lightboxIndex] && (
                <div
                    className="lightbox active"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                >
                    <button className="lightbox-close" onClick={closeLightbox} type="button">×</button>
                    <button
                        className="lightbox-nav lightbox-prev"
                        onClick={e => { e.stopPropagation(); prevImage(); }}
                        type="button"
                    >
                        &#10094;
                    </button>

                    <div
                        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <Image
                            src={displayItems[lightboxIndex].full_url}
                            alt={displayItems[lightboxIndex].title || 'Project'}
                            width={1200}
                            height={800}
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '85vh',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                display: 'block',
                            }}
                            priority
                        />
                    </div>

                    <button
                        className="lightbox-nav lightbox-next"
                        onClick={e => { e.stopPropagation(); nextImage(); }}
                        type="button"
                    >
                        &#10095;
                    </button>

                    <div className="lightbox-counter">
                        {lightboxIndex + 1} / {displayItems.length}
                    </div>
                </div>
            )}
        </>
    );
}
