'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
    const [visibleCount, setVisibleCount] = useState(24);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

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
        setVisibleCount(24);
    }, []);

    const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);

    const prevImage = useCallback(() => {
        setLightboxIndex(i => i !== null && displayItems.length > 0 ? (i - 1 + displayItems.length) % displayItems.length : null);
    }, [displayItems.length]);

    const nextImage = useCallback(() => {
        setLightboxIndex(i => i !== null && displayItems.length > 0 ? (i + 1) % displayItems.length : null);
    }, [displayItems.length]);

    const lightboxOpen = lightboxIndex !== null && Boolean(displayItems[lightboxIndex]);

    // Keep keyboard navigation and focus inside the lightbox only while it is open.
    useEffect(() => {
        if (!lightboxOpen) return;
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextImage();
            } else if (e.key === 'Tab') {
                const buttons = lightboxRef.current?.querySelectorAll<HTMLButtonElement>('button');
                if (!buttons?.length) return;
                const first = buttons[0];
                const last = buttons[buttons.length - 1];
                const focusOutside = !lightboxRef.current?.contains(document.activeElement);
                if (e.shiftKey && (document.activeElement === first || focusOutside)) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && (document.activeElement === last || focusOutside)) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = previousOverflow;
            if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        };
    }, [lightboxOpen, closeLightbox, prevImage, nextImage]);

    return (
        <div className="bg-[#050505] min-h-screen text-gray-300">
            {/* Header Section */}
            <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-24 border-b border-[#ad8d58]/20 bg-[#11120f]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08),_transparent_60%)] pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="block text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-semibold mb-6">RENDERLINE / SELECTED WORK</span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Architectural <span className="text-[var(--gold)]">work</span>
                    </h1>
                    <p className="text-base md:text-lg text-[#b9b8b0] max-w-2xl mx-auto mb-12 leading-relaxed">
                        A selection of renders, spatial studies and walkthroughs made to communicate each design with clarity.
                    </p>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {FILTERS.map(f => {
                            const isActive = filter === f.key;
                            const count = f.key === 'animation' 
                                ? videos.length 
                                : f.key === 'all' 
                                    ? items.length 
                                    : items.filter(i => i.category === f.key).length;
                            
                            return (
                                <button
                                    key={f.key}
                                    onClick={() => handleFilter(f.key)}
                                    className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-[0.12em] font-semibold transition-colors duration-300 border ${
                                        isActive 
                                            ? 'bg-[var(--gold)] border-[var(--gold)] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                                            : 'bg-[#111] border-[#333] text-gray-400 hover:border-[var(--gold)]/50 hover:text-white'
                                    }`}
                                    type="button"
                                >
                                    {f.label}
                                    <span className={`ml-2 text-xs ${isActive ? 'text-black/70' : 'text-gray-500'}`}>
                                        ({count})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Images Grid */}
            {!showVideos && (
                <section className="py-16 lg:py-24" id="portfolioSection">
                    <div className="container mx-auto px-6">
                        {displayItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {displayItems.slice(0, visibleCount).map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="relative group cursor-pointer aspect-[4/3] overflow-hidden bg-[#111] border border-[#ad9a69]/20 focus:outline-2 focus:outline-[var(--gold)]"
                                        onClick={() => openLightbox(idx)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                openLightbox(idx);
                                            }
                                        }}
                                    >
                                        {item.is_pinned && (
                                            <div className="absolute top-3 right-3 z-20 bg-[var(--gold)] text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                ★ Featured
                                            </div>
                                        )}
                                        <Image
                                            src={item.image_url}
                                            alt={item.title || 'Project'}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-10 flex items-end">
                                            <div className="p-5 md:p-6 w-full">
                                                <span className="block text-[var(--gold)] text-[10px] uppercase tracking-[0.2em] mb-2">{item.category || 'Project'} / {String(idx+1).padStart(2,'0')}</span>
                                                <p className="text-white font-medium text-base truncate drop-shadow-md">
                                                    {item.title || 'Untitled Project'}
                                                </p>
                                                <span className="text-[var(--gold)] text-xs uppercase tracking-[0.1em]">View render ↗</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 text-gray-500 border border-[#222] rounded-2xl bg-[#0a0a0a]">
                                <span className="text-4xl block mb-4">📭</span>
                                <p className="text-lg">No items found in this category.</p>
                            </div>
                        )}
                        {displayItems.length > visibleCount && (
                            <div className="mt-12 text-center">
                                <button type="button" className="btn-primary" onClick={() => setVisibleCount(count => count + 24)}>
                                    Show more projects ({displayItems.length - visibleCount} remaining)
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Animation / Video Section */}
            {showVideos && (
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-[var(--gold)] text-sm tracking-widest uppercase font-semibold">Cinematic Work</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
                                3D Walkthroughs &amp; <span className="text-[var(--gold)]">Animations</span>
                            </h2>
                            <div className="w-16 h-1 bg-[var(--gold)] mx-auto mb-6" />
                            <p className="text-gray-400">Cinematic architectural animations for real estate marketing.</p>
                        </div>

                        {videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {videos.map(vid => {
                                    const ytId = getYouTubeId(vid.video_url);
                                    return (
                                        <a
                                            key={vid.id}
                                            href={vid.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-[var(--gold)]/50 transition-colors"
                                        >
                                            <div className="relative aspect-video w-full bg-black">
                                                {ytId && (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                                                        onError={(e) => {
                                                            // Fallback to hqdefault if maxresdefault doesn't exist
                                                            const fallback = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                                                            if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                                                        }}
                                                        alt={vid.title || 'Video Thumbnail'}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                        loading="lazy"
                                                    />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors duration-500">
                                                    <div className="w-16 h-16 bg-[#ff0000] text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                                                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="text-lg font-bold text-white group-hover:text-[var(--gold)] transition-colors line-clamp-2">
                                                    {vid.title || 'Walkthrough Animation'}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-2">Watch on YouTube ↗</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-24 text-gray-500 border border-[#222] rounded-2xl bg-[#0a0a0a]">
                                <span className="text-4xl block mb-4">🎬</span>
                                <p className="text-lg">No videos added yet. Add videos from the admin panel.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Lightbox Overlay */}
            {lightboxIndex !== null && displayItems[lightboxIndex] && (
                <div
                    ref={lightboxRef}
                    className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center backdrop-blur-md"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label={displayItems[lightboxIndex].title || 'Project image'}
                >
                    {/* Close Button */}
                    <button 
                        ref={closeButtonRef}
                        className="absolute top-6 right-6 text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors z-50"
                        onClick={closeLightbox} 
                        type="button"
                        aria-label="Close image"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    {/* Previous Button */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-colors z-50"
                        onClick={e => { e.stopPropagation(); prevImage(); }}
                        type="button"
                        aria-label="Previous image"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative w-[90vw] h-[85vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        <Image
                            src={displayItems[lightboxIndex].full_url}
                            alt={displayItems[lightboxIndex].title || 'Project'}
                            fill
                            className="object-contain"
                            priority
                            sizes="90vw"
                        />
                    </div>

                    {/* Next Button */}
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-colors z-50"
                        onClick={e => { e.stopPropagation(); nextImage(); }}
                        type="button"
                        aria-label="Next image"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>

                    {/* Counter / Title */}
                    <div className="absolute bottom-6 left-0 right-0 text-center text-gray-400 text-sm">
                        <span className="text-white font-medium mr-3">{displayItems[lightboxIndex].title}</span>
                        {lightboxIndex + 1} / {displayItems.length}
                    </div>
                </div>
            )}
        </div>
    );
}
