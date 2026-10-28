"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "@/components/studio/RenderImage";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Files } from "lucide-react";
import VideoPreview from "@/components/studio/VideoPreview";
import { PORTFOLIO_CATEGORIES, workMatches } from "@/lib/services";

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
  initialFilter?: string;
}

const FILTERS = PORTFOLIO_CATEGORIES;

export default function PortfolioClient({
  items,
  videos,
  order,
  pinned,
  initialFilter,
}: Props) {
  const [filter, setFilter] = useState(
    PORTFOLIO_CATEGORIES.some((c) => c.key === initialFilter)
      ? initialFilter!
      : "all",
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Derive what to show from filter alone
  const showVideos = filter === "animation";

  // Get current category's arrays
  const currentOrder = order[filter] || [];
  const currentPinned = pinned[filter] || [];

  // Filter items based on category
  let displayItems =
    filter === "all"
      ? items
      : filter === "animation"
        ? []
        : items.filter((i) => workMatches(i, filter));

  // Apply sorting based on current category order
  if (!showVideos && displayItems.length > 0) {
    displayItems = [...displayItems]
      .sort((a, b) => {
        const aIdStr = String(a.id);
        const bIdStr = String(b.id);

        const aPinned = currentPinned.findIndex((id) => String(id) === aIdStr);
        const bPinned = currentPinned.findIndex((id) => String(id) === bIdStr);

        if (aPinned !== -1 && bPinned !== -1) return aPinned - bPinned;
        if (aPinned !== -1) return -1;
        if (bPinned !== -1) return 1;

        const idxA = currentOrder.findIndex((id) => String(id) === aIdStr);
        const idxB = currentOrder.findIndex((id) => String(id) === bIdStr);

        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      })
      .map((item) => ({
        ...item,
        is_pinned: currentPinned.some((id) => String(id) === String(item.id)),
      }));
  }

  const handleFilter = useCallback((key: string) => {
    setFilter(key);
    const url = new URL(window.location.href);
    url.searchParams.set("category", key);
    window.history.replaceState(null, "", url);
    setLightboxIndex(null);
    setVisibleCount(24);
  }, []);

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null && displayItems.length > 0
        ? (i - 1 + displayItems.length) % displayItems.length
        : null,
    );
  }, [displayItems.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null && displayItems.length > 0
        ? (i + 1) % displayItems.length
        : null,
    );
  }, [displayItems.length]);

  const lightboxOpen =
    lightboxIndex !== null && Boolean(displayItems[lightboxIndex]);

  // Keep keyboard navigation and focus inside the lightbox only while it is open.
  useEffect(() => {
    if (!lightboxOpen) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      } else if (e.key === "Tab") {
        const buttons =
          lightboxRef.current?.querySelectorAll<HTMLElement>("button,a[href]");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const focusOutside = !lightboxRef.current?.contains(
          document.activeElement,
        );
        if (e.shiftKey && (document.activeElement === first || focusOutside)) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last || focusOutside)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [lightboxOpen, closeLightbox, prevImage, nextImage]);

  return (
    <div className="rl-site edition-portfolio">
      <section className="premium-portfolio-header">
        <div className="rl-shell">
          <div className="edition-archive-title"><div><Link className="edition-back" href="/">RenderLine Studio / Portfolio</Link><h1>An archive of<br />imagined spaces.</h1></div><aside><p>Floor plans, front elevations, interiors and commercial spaces. Explore real work from the studio.</p><div><span><strong>{items.length}</strong>visualizations</span><span><strong>{videos.length}</strong>walkthrough films</span></div></aside></div>
          <div className="rl-filter-row">
            {FILTERS.map((f) => {
              const count =
                f.key === "animation"
                  ? videos.length
                  : f.key === "all"
                    ? items.length
                    : items.filter((i) => workMatches(i, f.key)).length;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={filter === f.key}
                  onClick={() => handleFilter(f.key)}
                >
                  {f.label} <span>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Images Grid */}
      {!showVideos && (
        <section className="py-9 lg:py-12" id="portfolioSection">
          <div className="rl-shell">
            {displayItems.length > 0 ? (
              <div className="studio-portfolio-grid">
                {displayItems.slice(0, visibleCount).map((item, idx) => (
                  <div
                    key={item.id}
                    className="studio-portfolio-tile"
                    onClick={() => openLightbox(idx)}
                    role="button"
                    aria-label={`Open visualization ${idx + 1}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openLightbox(idx);
                      }
                    }}
                  >
                    <div className="edition-portfolio-media"><Image
                      src={item.image_url}
                      alt={`RenderLine ${item.category || "architectural"} visualization`}
                      fill
                      className="object-cover  "
                      sizes="(max-width:700px) 45vw, (max-width:1100px) 45vw, 30vw"
                      loading={idx < 2 ? "eager" : "lazy"}
                    /></div><div className="edition-portfolio-caption"><span>{FILTERS.find(f=>f.key !== "all" && workMatches(item,f.key))?.label || "Visualization"}</span><span aria-hidden="true">↗</span></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="studio-gallery-empty">
                <Files size={32} strokeWidth={1.3} aria-hidden="true" />
                <p className="text-lg">
                  No public drawing samples are published in this category yet.
                </p>
                <Link className="rl-text-link" href="/drawing-samples">
                  Request a relevant drawing sample
                </Link>
              </div>
            )}
            <p className="rl-note mt-6">
              Open an image for a closer look.{" "}
              <Link
                className="rl-text-link"
                href={
                  displayItems[0]
                    ? `/portfolio/${displayItems[0].id}`
                    : "/drawing-samples"
                }
              >
                Explore project scope & related work
              </Link>
            </p>
            {displayItems.length > visibleCount && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  className="rl-button"
                  onClick={() => setVisibleCount((count) => count + 24)}
                >
                  Show more projects ({displayItems.length - visibleCount}{" "}
                  remaining)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Animation / Video Section */}
      {showVideos && (
        <section className="rl-section rl-shell">
          <h2>Walkthrough films.</h2>
          <p>Explore RenderLine spaces in motion. Choose a film to watch.</p>
          <div className="rl-film-grid" style={{ marginTop: 25 }}>
            {videos.map((vid) => (
              <VideoPreview
                key={vid.id}
                url={vid.video_url}
                title={vid.title}
              />
            ))}
          </div>
        </section>
      )}

      {lightboxIndex !== null && displayItems[lightboxIndex] && (
        <div ref={lightboxRef} className="studio-lightbox" onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Portfolio visualization">
          <div className="studio-lightbox-shell" onClick={event=>event.stopPropagation()}>
            <header className="studio-lightbox-header">
              <div><span>RenderLine Studio</span><h2>{FILTERS.find(f=>f.key!=="all" && workMatches(displayItems[lightboxIndex],f.key))?.label || "Architectural visualization"}</h2></div>
              <button ref={closeButtonRef} type="button" onClick={closeLightbox} aria-label="Close image"><X size={23} strokeWidth={1.5} aria-hidden="true" /></button>
            </header>
            <div className="studio-lightbox-image">
              <Image src={displayItems[lightboxIndex].full_url} alt={`RenderLine ${displayItems[lightboxIndex].category || "architectural"} visualization`} fill className="object-contain" priority sizes="90vw" />
            </div>
            <footer className="studio-lightbox-footer">
              <span className="studio-lightbox-count" aria-live="polite"><strong>{lightboxIndex+1}</strong> / {displayItems.length}</span>
              <div className="studio-lightbox-controls"><button type="button" onClick={prevImage} aria-label="Previous image"><ChevronLeft size={22} strokeWidth={1.6} aria-hidden="true" /></button><button type="button" onClick={nextImage} aria-label="Next image"><ChevronRight size={22} strokeWidth={1.6} aria-hidden="true" /></button></div>
              <Link href={`/portfolio/${displayItems[lightboxIndex].id}`} className="rl-button">View project<ArrowUpRight size={16} aria-hidden="true" /></Link>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
