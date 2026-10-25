"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <div className="rl-site">
      <section className="premium-portfolio-header">
        <div className="rl-shell">
          <p className="premium-intro-label">Selected work</p>
          <h1>The work speaks.</h1>
          <p>
            Real RenderLine visualizations, floor-plan studies and walkthrough
            films. Explore the work by discipline.
          </p>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {displayItems.slice(0, visibleCount).map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative group cursor-pointer aspect-[4/3] overflow-hidden bg-[#111] border border-[#ad9a69]/20 focus:outline-2 focus:outline-[var(--gold)]"
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
                    <Image
                      src={item.image_url}
                      alt={`RenderLine ${item.category || "architectural"} visualization`}
                      fill
                      className="object-cover  "
                      sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-gray-500 border border-[#222] rounded-2xl bg-[#0a0a0a]">
                <span className="text-4xl block mb-4">📭</span>
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
                  className="btn-primary"
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
          <h2>Pre-rendered walkthrough videos.</h2>
          <p>Real RenderLine animations. Choose Play to load a video.</p>
          <div className="rl-work-grid" style={{ marginTop: 25 }}>
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
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={displayItems[lightboxIndex].title || "Project image"}
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            className="absolute top-6 right-6 text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors z-50"
            onClick={closeLightbox}
            type="button"
            aria-label="Close image"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            type="button"
            aria-label="Previous image"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          {/* Image Container */}
          <div
            className="relative w-[90vw] h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={displayItems[lightboxIndex].full_url}
              alt={displayItems[lightboxIndex].title || "Project"}
              fill
              className="object-contain"
              priority
              sizes="90vw"
            />
          </div>

          {/* Next Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            type="button"
            aria-label="Next image"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          {/* Counter / Title */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-gray-400 text-sm">
            {lightboxIndex + 1} / {displayItems.length}
            <Link
              href={`/portfolio/${displayItems[lightboxIndex].id}`}
              onClick={(e) => e.stopPropagation()}
              className="block mt-2 text-white underline underline-offset-4"
            >
              Project details & quote
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
