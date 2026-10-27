import type { Metadata } from "next";
import Link from "next/link";
import CinematicShowcase from "@/components/studio/CinematicShowcase";
import StudioHero from "@/components/studio/StudioHero";
import {
  getSiteContent,
  getPortfolioItems,
  optimizeCloudinaryUrl,
} from "@/lib/supabase";
import { getPricing } from "@/lib/pricing-server";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import { PlanningRoadmap, StudioFaq } from "@/components/studio/StudioSections";
import PremiumServices from "@/components/studio/PremiumServices";
import PricingExplorer from "@/components/studio/PricingExplorer";
import WorkHighlights from "@/components/studio/WorkHighlights";
import EnquiryLink from "@/components/studio/EnquiryLink";
import { money } from "@/lib/pricing";
export const metadata: Metadata = {
  title: "House Plans, 3D Elevations & Interior Design | RenderLine Studio",
  description:
    "House plans, architectural booklets, 3D front elevations, interiors and visualization. Clear PKR guide pricing for homeowners, architects and developers.",
  alternates: { canonical: "/" },
};
export const revalidate = 60;
export default async function HomePage() {
  const [{ data: c }, { data: work }, pricing] = await Promise.all([
    getSiteContent(),
    getPortfolioItems(),
    getPricing(),
  ]);
  const items = work || [],
    number = publicWhatsAppNumber(c?.contact_whatsapp);
  const selected = [...items].sort((a, b) => {
    const ids = [187, 188, 186, 150, 164, 183];
    const x = ids.indexOf(Number(a.id)),
      y = ids.indexOf(Number(b.id));
    return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
  });
  const scenes = [
    { id: 187, label: "Residential exterior", category: "exterior" },
    { id: 188, label: "Interior design", category: "interior" },
    { id: 164, label: "Commercial design", category: "commercial" },
  ].flatMap((p) => {
    const item = items.find((i) => Number(i.id) === p.id);
    return item
      ? [
          {
            ...p,
            id: String(p.id),
            image: optimizeCloudinaryUrl(item.image_url, 1600),
          },
        ]
      : [];
  });
  return (
    <div className="rl-site premium-home">
      <StudioHero
        projects={[
          { id: 187, label: "Residential exterior", category: "exterior" },
          { id: 188, label: "Interior design", category: "interior" },
          { id: 164, label: "Commercial design", category: "commercial" },
        ].flatMap((project) => {
          const item = items.find((i) => Number(i.id) === project.id);
          return item
            ? [
                {
                  ...project,
                  id: String(project.id),
                  image: optimizeCloudinaryUrl(item.image_url, 1600),
                  thumbnail: optimizeCloudinaryUrl(item.image_url, 240),
                },
              ]
            : [];
        })}
      />
      <div className="spatial-entry-bar rl-shell">
        <div className="spatial-price-hint">
          <span>House plans from</span>
          <strong>{money(pricing.floorPlan.upTo10)}</strong>
          <small>Up to 10 marla / 2 storeys total</small>
        </div>
        <div className="premium-quick-paths">
          <Link href="/services/house-plans">
            <span>I have a plot.</span>
            <strong>Plan a home</strong>
          </Link>
          <Link href="/services/front-elevation">
            <span>I already have drawings.</span>
            <strong>See it in 3D</strong>
          </Link>
          <Link href="#professionals">
            <span>I am an architect or developer.</span>
            <strong>Work with the studio</strong>
          </Link>
        </div>
      </div>
      <CinematicShowcase scenes={scenes} />
      <section className="rl-section premium-work" id="work">
        <div className="rl-shell">
          <div className="rl-section-head">
            <div>
              <h2>A closer look at our work.</h2>
              <p>
                Residential, interior and commercial visualizations from the
                studio.
              </p>
            </div>
            <Link className="rl-text-link" href="/portfolio?category=animation">
              Watch walkthroughs
            </Link>
          </div>
          <WorkHighlights items={selected} limit={4} />
        </div>
      </section>
      <section className="rl-section rl-shell" id="services">
        <div className="rl-section-head">
          <div>
            <h2>The expertise behind your space.</h2>
          </div>
          <Link className="rl-text-link" href="/services">
            Explore all services
          </Link>
        </div>
        <PremiumServices items={selected} pricing={pricing} compact />
      </section>
      <section className="rl-section rl-shell" id="pricing">
        <PricingExplorer pricing={pricing} number={number} compact />
      </section>
      <section className="rl-section premium-process" id="how-it-works">
        <div className="rl-shell">
          <div className="rl-section-head">
            <div>
              <h2>
                From your first idea
                <br />
                to a clear next step.
              </h2>
            </div>
            <p>
              New to house planning? We make the stages easy to understand.
              Start with only the service you need.
            </p>
          </div>
          <PlanningRoadmap />
          <Link className="rl-text-link" href="/start-project">
            Build a short project brief
          </Link>
        </div>
      </section>
      <section className="rl-section rl-shell rl-partner" id="professionals">
        <div>
          <p className="premium-intro-label">
            For architects, designers & developers
          </p>
          <h2>
            Your design.
            <br />
            Our visualization expertise.
          </h2>
          <p>
            Bring your plans, model and references. We agree the scope, views
            and review stages, then turn your design intent into images and
            films you can present with confidence.
          </p>
          <div className="rl-actions">
            <Link
              className="rl-button"
              href="/start-project?service=exterior-visualization"
            >
              Work with our studio
            </Link>
            <EnquiryLink
              className="rl-text-link"
              number={number}
              message="Hello RenderLine Studio, I am an architect / developer and would like to discuss a recurring visualization workload and a tailored volume package."
            >
              Discuss a volume package
            </EnquiryLink>
          </div>
        </div>
        <div className="rl-partner-notes">
          <div>
            <h3>A scope you can review.</h3>
            <p>
              Views, modeling, drawings and source files are agreed before work
              starts.
            </p>
          </div>
          <div>
            <h3>A clear place for feedback.</h3>
            <p>
              Your invited project workspace keeps discussions and deliverables
              together.
            </p>
          </div>
          <div>
            <h3>Professional collaboration.</h3>
            <p>
              Agree confidentiality, revision rounds and delivery around the
              needs of your project.
            </p>
          </div>
        </div>
      </section>
      <section className="rl-section rl-shell rl-faq-section">
        <div>
          <h2>Before we begin.</h2>
        </div>
        <StudioFaq />
      </section>
      <section className="rl-final">
        <div className="rl-shell">
          <div>
            <p className="premium-intro-label">Let’s make a start</p>
            <h2>Tell us what you have in mind.</h2>
            <p>A plot, a plan, a reference—or simply the next question.</p>
          </div>
          <EnquiryLink
            className="rl-button"
            number={number}
            message="Hello RenderLine Studio, I would like to discuss my project and confirm the right service, scope and quotation."
          >
            Discuss your project
          </EnquiryLink>
        </div>
      </section>
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
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
