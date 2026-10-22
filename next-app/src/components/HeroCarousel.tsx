'use client';

import { useState, useEffect } from 'react';
import { optimizeCloudinaryUrl } from '@/lib/media';
import Link from 'next/link';

interface HeroCarouselProps {
    heroImages: string[];
    content: Record<string, string>;
}


export default function HeroCarousel({ heroImages, content }: HeroCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const legacyHeadline = String(content.hero_line1 || '').toLowerCase().includes('high-quality architectural');
    const heroLines = legacyHeadline
        ? ['Architecture,', 'made', 'clear.']
        : [content.hero_line1 || 'Architecture,', content.hero_line2 || 'made', content.hero_line3 || 'clear.'];
    const legacyDescription = String(content.hero_description || '').includes('photorealistic renders that captivate');
    const heroDescription = legacyDescription
        ? 'From architectural drawings to 3D exteriors, interiors and walkthroughs, we make the design easy to review and present.'
        : content.hero_description || 'From architectural drawings to 3D exteriors, interiors and walkthroughs, we make the design easy to review and present.';

    useEffect(() => {
        if (heroImages.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % heroImages.length);
        }, 5500);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    const prevSlide = () => {
        setActiveIndex((current) => (current - 1 + heroImages.length) % heroImages.length);
    };

    const nextSlide = () => {
        setActiveIndex((current) => (current + 1) % heroImages.length);
    };

    return (
        <header className="hero relative min-h-[82vh] w-full flex flex-col justify-center overflow-hidden">
            {/* Background slides */}
            <div className="hero-bg absolute inset-0 z-0">
                {heroImages.length > 0 ? (
                    heroImages.map((src, i) => (
                        <div
                            key={i}
                            className={`hero-slide absolute inset-0 transition-opacity duration-1000 ${
                                i === activeIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            {(i === 0 || i === activeIndex) && <img
                                src={optimizeCloudinaryUrl(src, 1920)}
                                alt={`Architectural visualization ${i + 1}`}
                                fetchPriority={i === 0 ? 'high' : 'low'}
                                decoding="async"
                                srcSet={`${optimizeCloudinaryUrl(src, 768)} 768w, ${optimizeCloudinaryUrl(src, 1280)} 1280w, ${optimizeCloudinaryUrl(src, 1920)} 1920w`}
                                sizes="100vw"
                                className="w-full h-full object-cover"
                            />}
                        </div>
                    ))
                ) : (
                    /* Fallback dark gradient when no images */
                    <div className="hero-slide absolute inset-0 opacity-100" style={{ background: 'linear-gradient(135deg, #0d0b09 0%, #161210 100%)' }} />
                )}
            </div>

            {/* Gradient overlay */}
            <div className="hero-overlay absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-[rgba(10,10,10,0.6)] to-transparent" />

            {/* Main content area */}
            <div className="hero-body relative z-20 pt-32 pb-24 md:pt-40 md:pb-32">
                <div className="container mx-auto px-6">
                    <div className="hero-text max-w-3xl">
                        <div className="hero-eyebrow text-[var(--gold)] text-sm tracking-widest uppercase mb-4 font-semibold">
                            <span>{String(content.hero_badge || '').toLowerCase().includes('premium 3d visualization') ? 'Drawings · Visuals · Walkthroughs' : content.hero_badge || 'Drawings · Visuals · Walkthroughs'}</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {heroLines[0]}{' '}
                            {heroLines[1]}{' '}
                            <span style={{ color: 'var(--gold)' }}>
                                {heroLines[2]}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                            {heroDescription}
                        </p>

                        <div className="hero-cta flex flex-col sm:flex-row gap-4 mt-8">
                            <Link href="/portfolio" className="btn-primary flex items-center justify-center gap-2">
                                {content.hero_btn1_text || 'View Portfolio'} <span className="text-lg leading-none">→</span>
                            </Link>
                            <Link href="/contact" className="btn-primary bg-transparent border-white/30 text-white hover:bg-white hover:text-black">
                                {content.hero_btn2_text || 'Start a Project'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slider Controls */}
            {heroImages.length > 1 && (
                <div className="absolute right-6 bottom-10 z-30 hidden md:flex gap-3 pointer-events-none">
                    <button 
                        onClick={prevSlide}
                        className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/20 hover:bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105"
                        aria-label="Previous slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/20 hover:bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105"
                        aria-label="Next slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}

        </header>
    );
}
