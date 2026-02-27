import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
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
    "Architectural Visualization",
    "3D Rendering",
    "Interior Design",
    "Walkthrough Animation",
    "RenderLine",
    "Lahore",
    "Pakistan",
  ],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${outfit.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
