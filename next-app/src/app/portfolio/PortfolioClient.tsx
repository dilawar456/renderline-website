'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface PortfolioItem {
    id: string | number;
    title: string;
    image_url: string;
    full_url: string;
    category?: string;
}

interface Video {
    id: string;
    title?: string;
    video_url: string;
}

interface Props {
    items: PortfolioItem[];
    videos: Video[];
}

function getYouTubeId(url: string) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s?]+)/);
    return match ? match[1] : null;
}

export default function PortfolioClient({ items, videos }: Props) {
    const [filter, setFilter] = useState('all');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [showVideos, setShowVideos] = useState(false);

    const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

    const handleFilter = useCallback((f: string) => {
        if (f === 'animation') {
            setShowVideos(true);
        } else {
            setShowVideos(false);
            setFilter(f);
        }
    }, []);

    const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);
    const prevImage = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : 0), [filtered.length]);
    const nextImage = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : 0), [filtered.length]);

    return (
        <>
            {/* Portfolio Grid */}
            {!showVideos && (
                <section className="portfolio-grid-section" id="portfolioSection">
                    <div className="portfolio-grid">
                        {filtered.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`portfolio-item mix ${item.category || ''}`}
                                onClick={() => openLightbox(idx)}
                            >
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    style={{ objectFit: 'cover', width: '100%', height: '250px' }}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Videos */}
            {showVideos && (
                <section className="video-section">
                    <div className="container">
                        <h2 className="text-center">3D Walkthroughs & Animations</h2>
                        <p className="text-center" style={{ maxWidth: '500px', margin: '0 auto 3rem' }}>
                            Cinematic architectural animations for real estate marketing.
                        </p>
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
                                            <div className="play-icon" />
                                        </div>
                                        <div className="video-info">
                                            <h4>{vid.title || 'Walkthrough Animation'}</h4>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Filter Buttons Script */}
            <script dangerouslySetInnerHTML={{
                __html: `
        (function() {
          document.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
              btn.classList.add('active');
            });
          });
        })();
      ` }} />

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div className="lightbox active" onClick={closeLightbox}>
                    <span className="lightbox-close" onClick={closeLightbox}>×</span>
                    <span className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); prevImage(); }}>&#10094;</span>
                    <Image
                        src={filtered[lightboxIndex].full_url}
                        alt={filtered[lightboxIndex].title}
                        width={1200}
                        height={800}
                        style={{ maxWidth: '90%', maxHeight: '85%', objectFit: 'contain', borderRadius: '8px' }}
                        onClick={e => e.stopPropagation()}
                        priority
                    />
                    <span className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); nextImage(); }}>&#10095;</span>
                    <div className="lightbox-counter">
                        <span>{lightboxIndex + 1}</span> / <span>{filtered.length}</span>
                    </div>
                </div>
            )}
        </>
    );
}
