import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "RenderLine | Premium Architectural Visualization",
    template: "%s | RenderLine",
  },
  description:
    "RenderLine is a premium architectural visualization studio in Lahore, Pakistan, specializing in photorealistic 3D rendering, interior design, and walkthrough animations.",
  keywords: [
    "Architectural Visualization", "3D Rendering", "Interior Design",
    "Walkthrough Animation", "RenderLine", "Lahore", "Pakistan",
  ],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${outfit.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />

        {/* WhatsApp Floating Button with Wave Rings */}
        <div className="wa-float">
          <span className="wa-wave" />
          <span className="wa-wave" />
          <span className="wa-wave" />
          <a
            href="https://wa.me/923114544040"
            className="wa-btn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.88.52 3.65 1.44 5.18L2 22l4.95-1.43A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.92 13.52c-.2.57-.99 1.04-1.64 1.18-.44.09-.99.17-5.2-2.23C7.2 12.4 6.04 10.2 5.93 10c-.1-.16-.8-1.12-.8-2.12 0-1 .53-1.48.72-1.68.18-.2.38-.25.5-.25h.37c.12 0 .28-.04.44.36.17.4.56 1.43.61 1.53.05.1.08.22.02.36-.07.13-.1.22-.2.34-.1.12-.22.27-.31.36-.1.1-.2.2-.09.4.12.2.52.88 1.12 1.43.77.72 1.42.94 1.62 1.05.2.1.31.09.43-.05.12-.14.5-.58.63-.78.13-.2.26-.17.44-.1l1.44.72c.2.1.33.14.38.23.04.09.04.53-.16 1.1z" />
            </svg>
          </a>
        </div>

        {/* ========================================================
            SCROLL REVEAL — IntersectionObserver
            Watches .reveal, .reveal-left, .reveal-right
            ======================================================== */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            function init() {
              var threshold = 0.13;
              var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                  }
                });
              }, { threshold: threshold, rootMargin: '0px 0px -40px 0px' });

              function observe() {
                document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function(el) {
                  if (!el.classList.contains('in-view')) obs.observe(el);
                });
              }

              observe();
              // Re-run after Next.js hydration might add more elements
              setTimeout(observe, 400);
              setTimeout(observe, 1000);
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', init);
            } else {
              init();
            }
          })();
        ` }} />

        {/* Navbar scrolled class */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            function updateNav() {
              var nav = document.querySelector('.navbar');
              if (!nav) return;
              if (window.scrollY > 60) {
                nav.classList.add('scrolled');
              } else {
                nav.classList.remove('scrolled');
              }
            }
            window.addEventListener('scroll', updateNav, { passive: true });
            updateNav();
          })();
        ` }} />
      </body>
    </html>
  );
}
