import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ClientPathways,
  SelectedWork,
  HomeServiceIndex,
  HomeProcess,
  StudioTrust,
  FinalEnquiry,
} from "@/components/studio/HomeSections";
import {
  getSiteContent,
  getPortfolioItems,
  optimizeCloudinaryUrl,
} from "@/lib/supabase";
import { getPricing } from "@/lib/pricing-server";
import { publicWhatsAppNumber } from "@/lib/public-contact";
export const metadata: Metadata = {
  title: "House Plans, 3D Elevations & Interior Design | RenderLine Studio",
  description:
    "House plans, architectural booklets, 3D front elevations, interior/exterior visualization and animation. Explore real RenderLine work and clear PKR guide prices.",
  alternates: { canonical: "/" },
};
export const revalidate = 60;
export default async function HomePage() {
  const [{ data: content }, { data: work }, pricing] = await Promise.all([
    getSiteContent(),
    getPortfolioItems(),
    getPricing(),
  ]);
  const items = work || [],
    number = publicWhatsAppNumber(content?.contact_whatsapp);
  const scenes = [
    { id: 187, label: "Residential exterior", category: "exterior" },
    { id: 188, label: "Interior design", category: "interior" },
    { id: 164, label: "Commercial design", category: "commercial" },
  ].flatMap((p) => {
    const image = items.find((i) => Number(i.id) === p.id);
    return image
      ? [
          {
            ...p,
            id: String(p.id),
            image: optimizeCloudinaryUrl(image.image_url, 1800),
            mobileImage: optimizeCloudinaryUrl(image.image_url, 850),
          },
        ]
      : [];
  });
  return (
    <div className="rl-site mission-home">
      <section className="studio-single-hero" id="home" data-hero="single" aria-label="RenderLine architectural design and visualization">
        {scenes[0] && <picture>
          <source media="(max-width:700px)" srcSet={scenes[0].mobileImage} />
          <Image src={scenes[0].image} alt="Residential front elevation by RenderLine Studio" fill unoptimized loading="eager" fetchPriority="high" sizes="100vw" />
        </picture>}
        <div className="studio-hero-copy rl-shell">
          <h1>Architecture,<br />made visible.</h1>
          <p>House plans, detailed drawings and 3D visuals.<br />From your first idea to the space you imagined.</p>
          <div className="rl-actions">
            <Link href="/start-project" className="rl-button">Start your project ↗</Link>
            <Link href="/portfolio" className="studio-hero-link">Explore our work ↗</Link>
          </div>
        </div>
      </section>
      <ClientPathways items={items} />
      <SelectedWork items={items} />
      <HomeServiceIndex pricing={pricing} />
      <HomeProcess />
      <StudioTrust
        image={content?.about_image || "/assets/dilawar-ali.jpg"}
        number={number}
      />
      <FinalEnquiry number={number} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RenderLine Studio",
            url: "https://renderline.pk",
            logo: "https://renderline.pk/assets/logo.png",
            telephone: "+" + number,
          }).replace(/</g, "\u003c"),
        }}
      />
    </div>
  );
}
