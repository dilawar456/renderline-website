import { publicMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { getPricing, getPortfolioItems } from "@/lib/public-data";
import { getSiteContent } from "@/lib/public-data";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import { money } from "@/lib/pricing";
import PortfolioArtwork from "@/components/studio/PortfolioArtwork";
import PricingExplorer from "@/components/studio/PricingExplorer";
export const metadata: Metadata = publicMetadata({
  title: "Service Prices & Complete Packages",
  description:
    "PKR guide rates for house plans, drawing booklets, elevations, interiors, commercial packages, structure and submission drawings.",
  alternates: { canonical: "/pricing" },
});
export const revalidate = 60;
export default async function PricingPage() {
  const [pricing, { data }, { data: work }] = await Promise.all([
    getPricing(),
    getSiteContent(),
    getPortfolioItems(),
  ]);
  return (
    <div className="rl-site spatial-pricing-page edition-pricing">
      <div className="rl-shell edition-page">
        <header className="atelier-pricing-lead">
          <div><Link href="/" className="edition-back">RenderLine Studio / Pricing</Link><h1>Good design.<br /><em>Clear choices.</em></h1><p>One service or the complete picture. Find the right scope for your space, with clear studio guide rates.</p><a href="#price-options" className="rl-button">Explore your options <span aria-hidden="true">↗</span></a><span className="atelier-lead-note">PKR guide rates · Scope confirmed before work begins</span></div>
          <PortfolioArtwork items={work || []} preferred={188} category="interior" caption="Interior visualization" priority />
        </header>
        <div className="edition-price-summary">
          <Link href="/services/house-plans"><span>Dimensioned floor plans</span><strong>{money(pricing.floorPlan.upTo10)}</strong><small>Up to 10 marla · up to 2 storeys total</small></Link>
          <Link href="/services/front-elevation"><span>3D front elevation</span><strong>{money(pricing.elevation.visualization)}</strong><small>Visualization of your front façade</small></Link>
          <Link href="/services/interior-design"><span>Interior design</span><strong>{money(pricing.interior.perSqFt)}<small> / sq ft</small></strong><small>Minimum {money(pricing.interior.minimumPerSpace)} per space</small></Link>
        </div>
      </div>
      <section className="rl-shell rl-section atelier-price-options" id="price-options" style={{ paddingTop: 10 }}>
        <PricingExplorer
          pricing={pricing}
          number={publicWhatsAppNumber(data?.contact_whatsapp)}
        />
        <section className="rl-faq edition-price-answers" aria-labelledby="price-answers-heading">
          <h2 id="price-answers-heading">Pricing, explained.</h2>
          <details><summary>Is the floor-plan price per storey?</summary><p>Standalone dimensioned floor plans cost {money(pricing.floorPlan.upTo10)} for plots up to 10 marla, or {money(pricing.floorPlan.upTo20)} up to 1 kanal. Each price covers up to two storeys in total. Furniture layouts and other architectural working details are separate.</p></details>
          <details><summary>What is included in a commercial complete package?</summary><p>The published complete package covers interior and exterior visualization with their working drawings, for up to two storeys. Basement and architectural drawings are excluded. Above 10 marla or more than two storeys, share the project details for a custom quotation.</p></details>
          <details><summary>How is an interior space priced?</summary><p>Interior design is {money(pricing.interior.perSqFt)} per square foot, with a minimum of {money(pricing.interior.minimumPerSpace)} for each individual space. Share each room or space separately so we can confirm its area and scope. Structural drawings and submission drawings are quoted as separate services.</p></details>
        </section>
      </section>
    </div>
  );
}
