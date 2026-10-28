import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import SiteFrame from "@/components/SiteFrame";
import Tracking from "@/components/Tracking";
import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";
import "./globals.css";
import "@/components/studio/studio.css";
import "@/components/studio/premium.css";
import "@/components/studio/cinematic.css";
import "@/components/studio/mission.css";
import "@/components/studio/editions.css";
import "@/components/studio/apple.css";
import "@/components/studio/atelier.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RenderLine | Premium Architectural Visualization",
    template: "%s | RenderLine",
  },
  description:
    "RenderLine is a premium architectural visualization studio in Lahore, Pakistan, specializing in photorealistic 3D rendering, interior design, and walkthrough animations.",
  keywords: [
    "Architectural Visualization",
    "3D Rendering",
    "Interior Design",
    "Walkthrough Animation",
    "RenderLine",
    "Lahore",
    "Pakistan",
  ],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('renderline-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body>
        <a className="rl-skip-link" href="#main-content">Skip to content</a>
        <SiteFrame>

          <Navbar />
        </SiteFrame>
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFrame>
          <Footer />
        </SiteFrame>

        <Tracking />
        {/* Scroll Reveal disabled, using CSS static opacity 1 */}
      </body>
    </html>
  );
}
