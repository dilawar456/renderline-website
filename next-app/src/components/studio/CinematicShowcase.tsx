"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
type Scene = { id: string; image: string; label: string; category: string };
export default function CinematicShowcase({ scenes }: { scenes: Scene[] }) {
  const root = useRef<HTMLElement>(null),
    [near, setNear] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el || scenes.length < 2) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let observing = false;
    const frames = Array.from(
      el.querySelectorAll<HTMLElement>(".cinema-frame"),
    );
    const captions = Array.from(
      el.querySelectorAll<HTMLElement>(".cinema-caption"),
    );
    const marks = Array.from(el.querySelectorAll<HTMLElement>(".cinema-step"));
    let visible = false;
    function render() {
      raf = 0;
      if (!visible || media.matches || document.hidden) return;
      const rect = el!.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)),
      );
      let position = p * (frames.length - 1);
      const ready = frames.map((frame) => {
        const image = frame.querySelector("img");
        return Boolean(image?.complete && image.naturalWidth);
      });
      if (!ready[Math.floor(position)] || !ready[Math.ceil(position)]) {
        const candidates = ready.flatMap((loaded, index) =>
          loaded ? [index] : [],
        );
        position =
          candidates.sort(
            (a, b) => Math.abs(a - position) - Math.abs(b - position),
          )[0] ?? 0;
      }
      frames.forEach((frame, i) => {
        const distance = Math.abs(position - i);
        frame.style.opacity = String(Math.max(0, 1 - distance));
        const local = Math.max(-1, Math.min(1, position - i));
        frame.style.transform = `translate3d(${local * -2.5}%,0,0) scale(${1.055 + Math.abs(local) * 0.045})`;
        captions[i].style.opacity = String(Math.max(0, 1 - distance * 2));
        captions[i].inert = Math.round(position) !== i;
        captions[i].setAttribute(
          "aria-hidden",
          String(Math.round(position) !== i),
        );
        marks[i].setAttribute(
          "aria-current",
          Math.round(position) === i ? "step" : "false",
        );
      });
      el!.style.setProperty("--cinema-progress", String(p));
    }
    function schedule() {
      if (!raf) raf = requestAnimationFrame(render);
    }
    function visibility() {
      if (!document.hidden) schedule();
    }
    function attach() {
      if (observing) return;
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      document.addEventListener("visibilitychange", visibility);
      observing = true;
      schedule();
    }
    function detach() {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
      observing = false;
      cancelAnimationFrame(raf);
      raf = 0;
    }
    function configure() {
      detach();
      if (media.matches) {
        delete el!.dataset.enhanced;
        frames.forEach((f) => {
          f.style.opacity = "";
          f.style.transform = "";
        });
        captions.forEach((c, i) => {
          c.style.opacity = "";
          c.inert = i !== 0;
          c.setAttribute("aria-hidden", String(i !== 0));
        });
        return;
      }
      el!.dataset.enhanced = "true";
      if (visible) attach();
    }
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) {
          setNear(true);
          if (!media.matches) attach();
        } else detach();
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(el);
    el.addEventListener("cinema-ready", schedule);
    configure();
    media.addEventListener("change", configure);
    return () => {
      observer.disconnect();
      el.removeEventListener("cinema-ready", schedule);
      detach();
      media.removeEventListener("change", configure);
    };
  }, [scenes.length]);
  return (
    <section
      className="cinema-section"
      ref={root}
      aria-label="Scroll through RenderLine design work"
    >
      <div className="cinema-stage">
        <div className="cinema-frames">
          {scenes.map((s, i) => (
            <div className="cinema-frame" key={s.id}>
              {(i === 0 || near) && (
                <Image
                  src={s.image}
                  unoptimized
                  fill
                  sizes="100vw"
                  alt={`RenderLine ${s.label.toLowerCase()} visualization`}
                  loading="lazy"
                  onLoad={() =>
                    root.current?.dispatchEvent(new Event("cinema-ready"))
                  }
                />
              )}
            </div>
          ))}
        </div>
        <div className="cinema-scrim" />
        <div className="cinema-intro">
          <h2>Step into the design.</h2>
          <p>Scroll to explore the studio’s work.</p>
        </div>
        <div className="cinema-captions">
          {scenes.map((s, i) => (
            <div
              className="cinema-caption"
              key={s.id}
              inert={i !== 0}
              aria-hidden={i !== 0}
            >
              <span>{s.label}</span>
              <Link href={"/portfolio?category=" + s.category}>
                Explore this work <span aria-hidden="true">↗</span>
              </Link>
              {i === 0 && (
                <span className="cinema-static-note">
                  Exterior, interiors and commercial design.
                </span>
              )}
            </div>
          ))}
        </div>
        <nav className="cinema-controls" aria-label="Visualization chapters">
          {scenes.map((s, i) => (
            <button
              type="button"
              className="cinema-step"
              key={s.id}
              aria-current={i === 0 ? "step" : "false"}
              onClick={() => {
                const el = root.current;
                if (!el) return;
                if (el.dataset.enhanced) {
                  const top =
                    el.getBoundingClientRect().top +
                    window.scrollY +
                    (el.offsetHeight - window.innerHeight) *
                      (i / (scenes.length - 1));
                  window.scrollTo({ top, behavior: "auto" });
                } else {
                  el.querySelectorAll<HTMLElement>(".cinema-frame").forEach(
                    (f, n) => (f.style.opacity = n === i ? "1" : "0"),
                  );
                  el.querySelectorAll<HTMLElement>(".cinema-caption").forEach(
                    (f, n) => {
                      f.style.opacity = n === i ? "1" : "0";
                      f.inert = n !== i;
                      f.setAttribute("aria-hidden", String(n !== i));
                    },
                  );
                  el.querySelectorAll(".cinema-step").forEach((b, n) =>
                    b.setAttribute("aria-current", n === i ? "step" : "false"),
                  );
                }
              }}
            >
              {s.label}
              <span />
            </button>
          ))}
        </nav>
        <div className="cinema-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
