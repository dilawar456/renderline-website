import type { Metadata } from "next";
import { getPricing } from "@/lib/pricing-server";
import { getSiteContent } from "@/lib/supabase";
import { publicWhatsAppNumber } from "@/lib/public-contact";
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
    <div className="rl-site spatial-pricing-page">
      <section className="rl-page-intro rl-shell">
        <h1>
          Good design.
          <br />
          Clear pricing.
        </h1>
        <p>
          Compare complete packages with individual services. These studio
          partner guide rates are available to homeowners, architects,
          developers and firms.
        </p>
      </section>
      <section className="rl-shell rl-section" style={{ paddingTop: 10 }}>
        <PricingExplorer
          pricing={pricing}
          number={publicWhatsAppNumber(data?.contact_whatsapp)}
        />
      </section>
    </div>
  );
}
