"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PORTFOLIO_CATEGORIES,
  workMatches,
  type PublicWork,
} from "@/lib/services";
import { optimizeCloudinaryUrl } from "@/lib/media";
export default function WorkHighlights({ items }: { items: PublicWork[] }) {
  const [category, setCategory] = useState("all");
  const visible = items.filter((i) => workMatches(i, category)).slice(0, 6);
  return (
    <>
      <div className="rl-filter-row" aria-label="Portfolio categories">
        {PORTFOLIO_CATEGORIES.map((c) => (
          <button
            type="button"
            key={c.key}
            aria-pressed={category === c.key}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
      {category === "animation" ? (
        <div className="rl-empty">
          <h3>See the design in motion.</h3>
          <p>Watch actual RenderLine pre-rendered walkthrough videos.</p>
          <Link className="rl-button" href="/portfolio?category=animation">
            Watch animations
          </Link>
        </div>
      ) : visible.length ? (
        <div className="rl-work-grid">
          {visible.map((i) => (
            <Link
              key={i.id}
              href={"/portfolio/" + i.id}
              aria-label={`Open ${i.category || "architectural"} portfolio example`}
            >
              <Image
                src={optimizeCloudinaryUrl(i.image_url, 850)}
                alt={`RenderLine ${i.category || "architectural"} visualization`}
                fill
                sizes="(max-width: 650px) 45vw, 32vw"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rl-empty">
          <h3>Ask to see the right drawing sample.</h3>
          <p>
            Published portfolio samples are not yet available for this category.
            We can review your requirements and share a relevant sample
            directly.
          </p>
          <Link className="rl-text-link" href="/services/drawing-booklets">
            Explore drawing booklet scope
          </Link>
        </div>
      )}
      <Link
        className="rl-text-link rl-gallery-more"
        href={"/portfolio?category=" + category}
      >
        Explore{" "}
        {category === "all"
          ? "the full portfolio"
          : PORTFOLIO_CATEGORIES.find(
              (c) => c.key === category,
            )?.label.toLowerCase()}
      </Link>
    </>
  );
}
