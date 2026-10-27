"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export default function MotionRuntime() {
  const path = usePathname();
  useEffect(() => {
    if (path.startsWith("/portal")) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const animations: Animation[] = [];
    function setup() {
      observer?.disconnect();
      if (media.matches) {
        animations.forEach((a) => a.cancel());
        return;
      }
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            animations.push(
              el.animate(
                [
                  { opacity: 0.12, transform: "translate3d(0,26px,0)" },
                  { opacity: 1, transform: "translate3d(0,0,0)" },
                ],
                {
                  duration: 700,
                  easing: "cubic-bezier(.22,1,.36,1)",
                  fill: "none",
                  delay: Number(el.dataset.motionDelay || 0),
                },
              ),
            );
            observer?.unobserve(el);
          }),
        { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
      );
      document
        .querySelectorAll<HTMLElement>(
          ".rl-site .rl-section-head>*, .rl-service-hero>*, .rl-work-grid>a, .premium-service-index>article, .premium-price-starts>article, .rl-roadmap>div, .rl-partner>*, .rl-faq details, .premium-package, .premium-rate-group, .rl-page-intro>*",
        )
        .forEach((el, i) => {
          if (el.getBoundingClientRect().top > window.innerHeight * 0.85) {
            el.dataset.motionDelay = String((i % 3) * 65);
            observer?.observe(el);
          }
        });
    }
    setup();
    media.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      animations.forEach((a) => a.cancel());
      media.removeEventListener("change", setup);
    };
  }, [path]);
  return <div className="rl-reading-progress" aria-hidden="true" />;
}
