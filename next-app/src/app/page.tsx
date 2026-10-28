import StructuredData from "@/components/studio/StructuredData";
import { SITE_URL } from "@/lib/site-url";
import { publicMetadata } from "@/lib/seo";
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
} from "@/lib/public-data";
import { getPricing } from "@/lib/public-data";
import { publicWhatsAppNumber } from "@/lib/public-contact";
export const metadata: Metadata = publicMetadata({
  title: "House Plans, 3D Elevations & Interior Design",
  description:
    "House plans, architectural booklets, 3D front elevations, interior/exterior visualization and animation. Explore real RenderLine work and clear PKR guide prices.",
  alternates: { canonical: "/" },
});
export const revalidate = 60;
export default async function HomePage() {
  const [{ data: content }, { data: work }, pricing] = await Promise.all([
    getSiteContent(),
    getPortfolioItems(),
    getPricing(),
  ]);
  const items = work || [],
    number = publicWhatsAppNumber(content?.contact_whatsapp);
  const heroItem = items.find(i => Number(i.id) === 187) || items.find(i => i.category?.includes("exterior"));
  const hero = heroItem ? { image: optimizeCloudinaryUrl(heroItem.image_url, 1800), mobileImage: optimizeCloudinaryUrl(heroItem.image_url, 850) } : null;
  return (
    <div className="rl-site mission-home">
      <section className="studio-single-hero" id="home" data-hero="single" aria-label="RenderLine architectural design and visualization">
        {hero && <picture>
          <source media="(max-width:700px)" srcSet={hero.mobileImage} />
          <Image src={hero.image} alt="Residential front elevation by RenderLine Studio" fill unoptimized loading="eager" fetchPriority="high" sizes="100vw" />
        </picture>}
        <div className="studio-hero-copy rl-shell">
          <h1>Architecture,<br />made visible.</h1>
          <p>Thoughtful house plans. Detailed drawings. Realistic 3D visuals. From your first idea to the space you imagined.</p>
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
      <StructuredData data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "Organization", "@id": SITE_URL + "/#studio", name: "RenderLine Studio", url: SITE_URL, logo: SITE_URL + "/assets/logo.png", telephone: "+" + number, address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" } },
        { "@type": "WebSite", "@id": SITE_URL + "/#website", name: "RenderLine Studio", url: SITE_URL, publisher: { "@id": SITE_URL + "/#studio" }, inLanguage: "en" },
      ] }} />
    </div>
  );
}
