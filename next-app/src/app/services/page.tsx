import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent, getPortfolioItems } from "@/lib/supabase";
import { getPricing } from "@/lib/pricing-server";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import {
  ServiceCards,
  PlanningRoadmap,
} from "@/components/studio/StudioSections";
const legacy: Record<string, string> = {
  plans: "house-plans",
  drawings: "drawing-booklets",
  exterior: "exterior-visualization",
  interior: "interior-design",
  walkthrough: "walkthrough-animation",
};
export const metadata: Metadata = {
  title: "House Plans, Elevations & Visualization Services",
  description:
    "Choose house planning, architectural booklets, 3D elevations, interior/exterior design, 3D modeling or walkthrough video services.",
  alternates: { canonical: "/services" },
};
export const revalidate = 60;
export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [query, { data: c }, { data: items }, pricing] = await Promise.all([
    searchParams,
    getSiteContent(),
    getPortfolioItems(),
    getPricing(),
  ]);
  return (
    <div className="rl-site">
      <section className="rl-page-intro rl-shell">
        <h1>
          From the first layout
          <br />
          to the final visual.
        </h1>
        <p>
          Choose a single service or coordinate your project with the studio.
          Every quotation states its drawings, views, revision scope and
          deliverables.
        </p>
        {query.service && (
          <Link
            className="rl-text-link"
            href={"/services/" + (legacy[query.service] || "house-plans")}
          >
            Open the service you selected
          </Link>
        )}
      </section>
      <section
        className="rl-section rl-shell"
        id="services-list"
        style={{ paddingTop: 15 }}
      >
        <ServiceCards
          items={items || []}
          pricing={pricing}
          number={publicWhatsAppNumber(c?.contact_whatsapp)}
        />
      </section>
      <section className="rl-process-section rl-section">
        <div className="rl-shell">
          <h2>A clear route through your project.</h2>
          <PlanningRoadmap />
          <Link className="rl-button" href="/start-project">
            Find my starting point
          </Link>
        </div>
      </section>
    </div>
  );
}
