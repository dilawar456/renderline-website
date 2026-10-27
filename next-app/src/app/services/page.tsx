import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolioItems } from "@/lib/public-data";
import { getPricing } from "@/lib/public-data";
import { PageHeading } from "@/components/studio/InnerPage";
import PremiumServices from "@/components/studio/PremiumServices";
import { PlanningRoadmap } from "@/components/studio/StudioSections";
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
  const [query, { data: items }, pricing] = await Promise.all([
    searchParams,
    getPortfolioItems(),
    getPricing(),
  ]);
  return (
    <div className="rl-site edition-services">
      <div className="rl-shell edition-page">
        <PageHeading title="The right expertise. At every stage." description="Start with a floor plan, develop a complete drawing package, or bring an existing design to life in 3D.">
          <a href="#services-list" className="rl-text-link">Explore the services ↓</a>
        </PageHeading>
        <nav className="edition-discipline-nav" aria-label="Service disciplines"><Link href="/services/house-plans">Plan your space ↗</Link><Link href="/services/drawing-booklets">Detail your design ↗</Link><Link href="/services/exterior-visualization">Visualize your project ↗</Link></nav>
        {query.service && (
          <Link
            className="rl-text-link"
            href={"/services/" + (legacy[query.service] || "house-plans")}
          >
            Open the service you selected
          </Link>
        )}
      </div>
      <section
        className="rl-section rl-shell"
        id="services-list"
        style={{ paddingTop: 15 }}
      >
        <PremiumServices items={items || []} pricing={pricing} />
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
