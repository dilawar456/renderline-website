import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import "@fontsource-variable/cinzel";
import "@fontsource-variable/outfit";
import "@fontsource-variable/manrope";
import SiteFrame from "@/components/SiteFrame";
import Tracking from "@/components/Tracking";
import WhatsAppLink from "@/components/WhatsAppLink";
import Navbar from "@/components/Navbar";
import MotionRuntime from "@/components/studio/MotionRuntime";
import Footer from "@/components/Footer";
import "./globals.css";
import "@/components/studio/studio.css";
import "@/components/studio/premium.css";
import "@/components/studio/cinematic.css";
import "@/components/studio/mission.css";

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
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('renderline-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body>
        <SiteFrame>
          <MotionRuntime />
          <Navbar />
        </SiteFrame>
        <main>{children}</main>
        <SiteFrame>
          <Footer />
        </SiteFrame>

        {/* WhatsApp Floating Button */}
        <SiteFrame>
          <div className="rl-floating-contact">
            {/* Direct contact */}

            <WhatsAppLink
              source="floating_button"
              className="relative z-10 w-14 h-14 bg-black/40 backdrop-blur-md border border-[#25d366]/50 text-[#25d366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.25)] hover:bg-[#25d366] hover:text-black hover:scale-110 transition-all duration-300"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
            </WhatsAppLink>
          </div>
        </SiteFrame>
        <Tracking />
        {/* Scroll Reveal disabled, using CSS static opacity 1 */}
      </body>
    </html>
  );
}
