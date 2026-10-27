"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
type Project = {
  id: string;
  image: string;
  thumbnail: string;
  label: string;
  category: string;
};
export default function StudioHero({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const project = projects[active];
  return (
    <section
      className="spatial-hero"
      aria-label="RenderLine architectural design and visualization"
    >
      {project && (
        <Image
          key={project.id}
          unoptimized
          className="spatial-hero-image"
          src={project.image}
          alt={`RenderLine ${project.label.toLowerCase()} visualization`}
          fill
          priority={active === 0}
          sizes="100vw"
        />
      )}
      <div className="spatial-hero-shade" />
      <div className="spatial-hero-top">
        <span>Architecture & visualization studio</span>
        <span>Lahore, Pakistan / Working worldwide</span>
      </div>
      <div className="spatial-hero-content">
        <h1>
          Architecture,
          <br />
          made visible.
        </h1>
        <p>
          House plans, detailed drawings and 3D visuals.
          <br />
          From the first idea to the space you imagined.
        </p>
        <div className="rl-actions">
          <Link href="/start-project" className="rl-button">
            Start your project{" "}
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
          </Link>
          <Link href="/portfolio" className="spatial-hero-work">
            Explore our work
          </Link>
        </div>
      </div>
      <div className="spatial-hero-picker" aria-label="Featured visualization">
        {projects.map((p, i) => (
          <button
            type="button"
            aria-pressed={active === i}
            aria-label={`View ${p.label.toLowerCase()}`}
            key={p.id}
            onClick={() => setActive(i)}
          >
            <span className="spatial-hero-thumb">
              <Image src={p.thumbnail} unoptimized alt="" fill sizes="96px" />
            </span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
      <p className="spatial-hero-caption" aria-live="polite">
        {project?.label} by RenderLine Studio
      </p>
    </section>
  );
}
