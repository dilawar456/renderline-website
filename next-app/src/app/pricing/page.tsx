import type { Metadata } from "next";
import Link from "next/link";
import { getPricing } from "@/lib/public-data";
import { getSiteContent } from "@/lib/public-data";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import { PageHeading } from "@/components/studio/InnerPage";
import { money } from "@/lib/pricing";
import PricingExplorer from "@/components/studio/PricingExplorer";
export const metadata: Metadata = {
  title: "Service Prices & Complete Packages",
  description:
    "PKR guide rates for house plans, drawing booklets, elevations, interiors, commercial packages, structure and submission drawings.",
  alternates: { canonical: "/pricing" },
};
export const revalidate = 60;
export default async function PricingPage() {
  const [pricing, { data }] = await Promise.all([
    getPricing(),
    getSiteContent(),
  ]);
  return (
    <div className="rl-site spatial-pricing-page edition-pricing">
      <div className="rl-shell edition-page">
        <PageHeading title="Good design. Clear choices." description="Single services or coordinated packages. Studio partner guide rates, open to homeowners, architects and developers." />
        <div className="edition-price-summary">
          <Link href="/services/house-plans"><span>Dimensioned floor plans</span><strong>{money(pricing.floorPlan.upTo10)}</strong><small>Up to 10 marla · up to 2 storeys total</small></Link>
          <Link href="/services/front-elevation"><span>3D front elevation</span><strong>{money(pricing.elevation.visualization)}</strong><small>Visualization of your front façade</small></Link>
          <Link href="/services/interior-design"><span>Interior design</span><strong>{money(pricing.interior.perSqFt)}<small> / sq ft</small></strong><small>Minimum {money(pricing.interior.minimumPerSpace)} per space</small></Link>
        </div>
      </div>
      <section className="rl-shell rl-section" style={{ paddingTop: 10 }}>
        <PricingExplorer
          pricing={pricing}
          number={publicWhatsAppNumber(data?.contact_whatsapp)}
        />
      </section>
    </div>
  );
}
