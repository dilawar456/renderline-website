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
  keywords: ["Architectural Visualization", "3D Rendering", "Interior Design", "Walkthrough Animation", "RenderLine", "Lahore", "Pakistan"],
  authors: [{ name: "RenderLine" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    siteName: "RenderLine",
    images: ["/assets/images/render12.jpg"],
  },
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

        {/* Scroll animation observer */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                  if (e.isIntersecting) { e.target.classList.add('visible'); }
                });
              }, { threshold: 0.12 });
              document.querySelectorAll('.fade-in').forEach(function(el) { obs.observe(el); });

              // Re-observe after dynamic content
              setTimeout(function() {
                document.querySelectorAll('.fade-in').forEach(function(el) { obs.observe(el); });
              }, 1000);
            })();
          `
        }} />
      </body>
    </html>
  );
}
