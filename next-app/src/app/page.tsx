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
import {
  ServiceCards,
  PlanningRoadmap,
  StudioFaq,
} from "@/components/studio/StudioSections";
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
  const [contentRes, workRes, pricing] = await Promise.all([
    getSiteContent(),
    getPortfolioItems(),
    getPricing(),
  ]);
  const c = contentRes.data || {},
    items = workRes.data || [],
    number = publicWhatsAppNumber(c.contact_whatsapp);
  const hero =
    items.find((i) => Number(i.id) === 186) ||
    items.find((i) => i.category === "exterior");
  const interior =
    items.find((i) => Number(i.id) === 188) ||
    items.find((i) => i.category === "interior");
  const selected = [...items].sort((a, b) => {
    const ids = [186, 188, 150, 164, 187, 183];
    const x = ids.indexOf(Number(a.id)),
      y = ids.indexOf(Number(b.id));
    return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
  });
  return (
    <div className="rl-site">
      <section className="rl-hero rl-shell">
        <div className="rl-hero-copy">
          <p className="rl-location">RenderLine Studio · Lahore, Pakistan</p>
          <h1>From floor plans to beautiful 3D designs.</h1>
          <p className="rl-lead">
            Professional house plans, working drawings, 3D elevations and
            interiors. Clear pricing. A simple process. A design you can
            understand.
          </p>
          <div className="rl-actions">
            <Link
              className="rl-button"
              href="/start-project?service=house-plans"
            >
              Start my house plan
            </Link>
            <Link className="rl-button rl-button-quiet" href="/portfolio">
              Explore our portfolio
            </Link>
          </div>
          <Link className="rl-professional-link" href="#professionals">
            Already an architect? Find your visualization partner.
          </Link>
          <div className="rl-hero-price">
            <span>House plans, up to 10 marla / 2 storeys</span>
            <strong>{money(pricing.floorPlan.upTo10)}</strong>
            <Link href="/pricing">See scope & all prices</Link>
          </div>
        </div>
        <div className="rl-hero-composition">
          {hero && (
            <div className="rl-hero-image">
              <Image
                src={optimizeCloudinaryUrl(hero.image_url, 1500)}
                alt="RenderLine neoclassical house elevation visualization"
                fill
                priority
                sizes="(max-width: 800px) 100vw, 56vw"
              />
            </div>
          )}
          {interior && (
            <Link href="/services/interior-design" className="rl-hero-inset">
              <Image
                src={optimizeCloudinaryUrl(interior.image_url, 500)}
                alt="Interior visualization from the RenderLine portfolio"
                fill
                sizes="230px"
              />
              <span>Spaces, thoughtfully considered.</span>
            </Link>
          )}
          <div className="rl-image-caption">
            <span>Real RenderLine work</span>
            <Link href="/portfolio?category=elevation">
              Explore front elevations
            </Link>
          </div>
        </div>
      </section>
      <div className="rl-audiences rl-shell">
        <Link href="/start-project?service=house-plans">
          <strong>I have a plot.</strong>
          <span>Help me plan my home.</span>
        </Link>
        <Link href="/services/front-elevation">
          <strong>I already have drawings.</strong>
          <span>Bring my design to life.</span>
        </Link>
        <Link href="#professionals">
          <strong>I am an architect or developer.</strong>
          <span>Find a reliable studio partner.</span>
        </Link>
      </div>
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
            sameAs: ["https://instagram.com/renderline.arch"],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section className="rl-section rl-shell" id="services">
        <div className="rl-section-head">
          <div>
            <h2>What do you need help with?</h2>
            <p>
              One service or a coordinated package. Start where your project is.
            </p>
          </div>
          <Link className="rl-text-link" href="/services">
            All services
          </Link>
        </div>
        <ServiceCards
          items={selected}
          pricing={pricing}
          number={number}
          compact
        />
      </section>
      <section className="rl-section rl-work-section" id="work">
        <div className="rl-shell">
          <div className="rl-section-head">
            <div>
              <h2>Explore our work by category.</h2>
              <p>
                Actual plans, visualizations and walkthroughs from the studio.
              </p>
            </div>
          </div>
          <WorkHighlights items={selected} />
        </div>
      </section>
      <section className="rl-section rl-shell" id="pricing">
        <PricingExplorer pricing={pricing} number={number} compact />
      </section>
      <section className="rl-section rl-process-section" id="how-it-works">
        <div className="rl-shell">
          <div className="rl-section-head">
            <div>
              <h2>Have a plot but don’t know where to start?</h2>
              <p>
                A clear route from your requirements to the drawings and visuals
                you need.
              </p>
            </div>
            <Link className="rl-button" href="/start-project">
              Let’s plan your project
            </Link>
          </div>
          <PlanningRoadmap />
          <p className="rl-note">
            This is a typical planning journey, not a required bundle. You can
            start with only the service you need. The drawing index, specialist
            disciplines and file formats are agreed for your project.
          </p>
        </div>
      </section>
      <section className="rl-section rl-shell rl-partner" id="professionals">
        <div>
          <p className="rl-location">
            For architects, designers, developers & firms
          </p>
          <h2>Your architectural visualization partner.</h2>
          <p>
            Send your drawings or model. We agree the views, level of detail,
            references and review stages, then build the visuals around your
            design intent.
          </p>
          <p>
            Interior and exterior renders, architectural modeling and
            pre-rendered walkthrough videos—with project feedback kept in one
            invited workspace.
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
              message="Hello RenderLine Studio, I am an architect / developer and would like a quotation for recurring visualization work. I can share my project scope and workload."
            >
              Discuss a volume package
            </EnquiryLink>
          </div>
        </div>
        <div className="rl-partner-notes">
          <div>
            <h3>Your design stays yours.</h3>
            <p>
              Agree confidentiality and sharing requirements before work starts.
            </p>
          </div>
          <div>
            <h3>A reviewable process.</h3>
            <p>
              References, feedback and deliverables stay tied to the project.
            </p>
          </div>
          <div>
            <h3>A scope you can price.</h3>
            <p>
              Separate views, modeling, source files and extra disciplines are
              agreed upfront. International work receives a project-specific
              currency quotation.
            </p>
          </div>
        </div>
      </section>
      <section className="rl-section rl-shell rl-faq-section">
        <h2>A few things worth knowing.</h2>
        <StudioFaq />
      </section>
      <section className="rl-final">
        <div className="rl-shell">
          <div>
            <h2>Start with what you have.</h2>
            <p>
              A plot size, a drawing, a reference—or simply a room you want to
              rethink.
            </p>
          </div>
          <EnquiryLink
            className="rl-button"
            number={number}
            message="Hello RenderLine Studio, I would like to discuss a project and confirm the right service and scope."
          >
            Discuss my project on WhatsApp
          </EnquiryLink>
        </div>
      </section>
    </div>
  );
}
