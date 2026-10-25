import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  const hero =
    items.find((i) => Number(i.id) === 187) ||
    items.find((i) => i.category === "exterior");
  const selected = [...items].sort((a, b) => {
    const ids = [187, 188, 186, 150, 164, 183];
    const x = ids.indexOf(Number(a.id)),
      y = ids.indexOf(Number(b.id));
    return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
  });
  return (
    <div className="rl-site premium-home">
      <section className="premium-hero rl-shell">
        <div className="premium-hero-copy">
          <p className="premium-intro-label">
            Architectural design & visualization
          </p>
          <h1>
            From floor plans
            <br />
            to beautiful spaces.
          </h1>
          <p className="premium-hero-description">
            House plans, detailed drawings and considered 3D visuals. One studio
            to help you plan, see and present your next project.
          </p>
          <div className="rl-actions">
            <Link
              className="rl-button"
              href="/start-project?service=house-plans"
            >
              Start your project
            </Link>
            <Link className="rl-text-link" href="/portfolio">
              View our work
            </Link>
          </div>
          <p className="premium-hero-budget">
            House plans from <strong>{money(pricing.floorPlan.upTo10)}</strong>
            <span>Up to 10 marla · 2 storeys</span>
          </p>
        </div>
        <figure className="premium-hero-figure">
          {hero && (
            <div className="premium-hero-photo">
              <Image
                src={optimizeCloudinaryUrl(hero.image_url, 1600)}
                alt="RenderLine residential exterior visualization with lawn and garage"
                fill
                priority
                sizes="(max-width:800px) 100vw, 56vw"
              />
            </div>
          )}
          <figcaption>
            <span>Residential architecture, visualized by RenderLine.</span>
            <Link href="/portfolio?category=exterior">Explore exteriors</Link>
          </figcaption>
        </figure>
      </section>
      <div className="premium-quick-paths rl-shell">
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
      <section className="rl-section rl-shell" id="services">
        <div className="rl-section-head">
          <div>
            <p className="premium-intro-label">
              The right service, at the right stage
            </p>
            <h2>What are you planning?</h2>
          </div>
          <Link className="rl-text-link" href="/services">
            Explore all services
          </Link>
        </div>
        <PremiumServices items={selected} pricing={pricing} compact />
      </section>
      <section className="rl-section premium-work" id="work">
        <div className="rl-shell">
          <div className="rl-section-head">
            <div>
              <p className="premium-intro-label">Selected work</p>
              <h2>Design, made visible.</h2>
              <p>
                A closer look at the studio’s real projects and visualization
                work.
              </p>
            </div>
            <Link className="rl-text-link" href="/portfolio?category=animation">
              Watch walkthroughs
            </Link>
          </div>
          <WorkHighlights items={selected} />
        </div>
      </section>
      <section className="rl-section rl-shell" id="pricing">
        <PricingExplorer pricing={pricing} number={number} compact />
      </section>
      <section className="rl-section premium-process" id="how-it-works">
        <div className="rl-shell">
          <div className="rl-section-head">
            <div>
              <p className="premium-intro-label">A considered process</p>
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
          <p className="premium-intro-label">Before you begin</p>
          <h2>The useful details.</h2>
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
