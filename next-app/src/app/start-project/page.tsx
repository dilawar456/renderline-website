import type { Metadata } from "next";
import ProjectStarter from "@/components/studio/ProjectStarter";
import { getPricing } from "@/lib/public-data";
import { getSiteContent } from "@/lib/public-data";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import { SERVICES } from "@/lib/services";
export const metadata: Metadata = {
  title: "Start Your Design Project",
  description:
    "Build a short project brief for house plans, working drawings, 3D elevations, interiors or architectural visualization.",
  alternates: { canonical: "/start-project" },
};
export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [query, p, { data }] = await Promise.all([
    searchParams,
    getPricing(),
    getSiteContent(),
  ]);
  const initial = SERVICES.some((s) => s.slug === query.service)
    ? query.service
    : "house-plans";
  return (
    <div className="rl-site">
      <section className="rl-page-intro rl-shell">
        <h1>Let’s plan your project.</h1>
        <p>
          A short, optional guide to the right service. Your details stay in
          this page until you choose to open WhatsApp.
        </p>
      </section>
      <div className="rl-shell rl-start-page">
        <ProjectStarter
          pricing={p}
          number={publicWhatsAppNumber(data?.contact_whatsapp)}
          initial={initial}
        />
      </div>
    </div>
  );
}
