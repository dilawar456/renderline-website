import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SERVICES, workMatches } from "@/lib/services";
import { servicePrice } from "@/lib/service-price";
import { getPricing } from "@/lib/public-data";
import {
  getPortfolioItems,
  getSiteContent,
  getVideos,
  optimizeCloudinaryUrl,
} from "@/lib/public-data";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import EnquiryLink from "@/components/studio/EnquiryLink";
import { money } from "@/lib/pricing";
import VideoPreview from "@/components/studio/VideoPreview";
export const revalidate = 60;
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params,
    s = SERVICES.find((s) => s.slug === slug);
  return s
    ? {
        title: s.title,
        description: s.description,
        alternates: { canonical: "/services/" + s.slug },
      }
    : { title: "Service not found" };
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    s = SERVICES.find((s) => s.slug === slug);
  if (!s) notFound();
  const [pricing, { data: items }, { data: c }, { data: videos }] =
    await Promise.all([
      getPricing(),
      getPortfolioItems(),
      getSiteContent(),
      getVideos(),
    ]);
  const examples = (items || [])
      .filter((i) => workMatches(i, s.category))
      .slice(0, 4),
    number = publicWhatsAppNumber(c?.contact_whatsapp);
  return (
    <div className="rl-site">
      <section className="rl-shell rl-service-hero">
        <div>
          <Link className="rl-text-link" href="/services">
            All services
          </Link>
          <h1 style={{ marginTop: 25 }}>
            {s.slug === "front-elevation"
              ? "See your house before it’s built."
              : s.title}
          </h1>
          <p>{s.description}</p>
          <strong className="rl-service-price">
            {servicePrice(slug, pricing)}
          </strong>
          <div className="rl-actions" style={{ marginTop: 25 }}>
            <Link className="rl-button" href={"/start-project?service=" + slug}>
              Start my{" "}
              {s.slug === "front-elevation" ? "front elevation" : "project"}
            </Link>
            <EnquiryLink
              className="rl-text-link"
              number={number}
              message={`Hello RenderLine Studio, I need ${s.title}. Please review my drawings and confirm the scope and quotation.`}
            >
              Get a quote on WhatsApp
            </EnquiryLink>
          </div>
        </div>
        {s.category === "animation" && videos?.[0] ? (
          <VideoPreview url={videos[0].video_url} title={videos[0].title} />
        ) : examples[0] ? (
          <div className="rl-detail-image">
            <Image
              src={optimizeCloudinaryUrl(examples[0].image_url, 1100)}
              alt={`RenderLine ${s.title} portfolio example`}
              fill
              priority
              sizes="(max-width: 600px) 90vw, 45vw"
            />
          </div>
        ) : (
          <div className="rl-scope-box">
            <h2>Your project’s drawing index.</h2>
            <p>Plans. Elevations. Sections. Architectural details.</p>
            <p>
              We agree the actual sheets and specialist disciplines before
              starting. Ask for a sample matched to your plot and requirements.
            </p>
            <Link className="rl-text-link" href="/drawing-samples">
              Explore drawing sample options
            </Link>
          </div>
        )}
      </section>
      <section className="rl-section rl-shell rl-deliverables">
        <div>
          <h2>What you receive.</h2>
          <ul className="rl-list">
            {s.includes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {slug === "house-plans" && (
            <p>
              Standalone dimensioned plans: up to 10 marla{" "}
              {money(pricing.floorPlan.upTo10)}, above 10 marla to 1 kanal{" "}
              {money(pricing.floorPlan.upTo20)}—total for up to two storeys.
              Furniture layouts and remaining architectural details are
              excluded. Larger plots or additional storeys need a custom quote.
            </p>
          )}
          {slug === "front-elevation" && (
            <p>
              3D front elevation: {money(pricing.elevation.visualization)}.
              Working from an existing elevation:{" "}
              {money(pricing.elevation.working)}. Both together:{" "}
              {money(pricing.elevation.combined)}.
            </p>
          )}
          <p className="rl-note">
            Source models, editable CAD files, file formats, revision rounds and
            delivery dates are included only as agreed in the written quotation.
            Site supervision and construction contracting are not part of these
            services.
          </p>
        </div>
        <div className="rl-scope-box">
          <h3>What to share with us.</h3>
          <p>{s.needs}</p>
          <p>
            Send files inside WhatsApp after opening the conversation, or in
            your invited project workspace.
          </p>
          <Link className="rl-text-link" href="/pricing">
            Compare full packages & individual rates
          </Link>
        </div>
      </section>
      <section className="rl-section rl-work-section">
        <div className="rl-shell">
          <div className="rl-section-head">
            <h2>
              {s.category === "animation"
                ? "Walkthroughs from our studio."
                : examples.length
                  ? "Relevant work from our studio."
                  : "Find a sample for your project."}
            </h2>
            <Link
              className="rl-text-link"
              href={"/portfolio?category=" + s.category}
            >
              View this category
            </Link>
          </div>
          {s.category === "animation" ? (
            <div className="rl-work-grid">
              {(videos || []).slice(1, 4).map((v) => (
                <VideoPreview key={v.id} url={v.video_url} title={v.title} />
              ))}
            </div>
          ) : examples.length ? (
            <div className="rl-work-grid">
              {examples.map((i) => (
                <Link
                  href={"/portfolio/" + i.id}
                  key={i.id}
                  aria-label={`Open ${s.title} example`}
                >
                  <Image
                    src={optimizeCloudinaryUrl(i.image_url, 750)}
                    alt={`${s.title} visualization example`}
                    fill
                    sizes="(max-width:600px) 45vw, 30vw"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p>
              No public working-drawing PDF is published yet. Request a relevant
              sample; the sample library will list real documents and page
              previews when provided.
            </p>
          )}
          {s.category === "floorplan" && (
            <p className="rl-note">
              These published examples are 3D floor-plan studies. Ask for a
              dimensioned 2D drawing sample separately.
            </p>
          )}
        </div>
      </section>
      <section className="rl-section rl-shell">
        <h2>A straightforward process.</h2>
        <div className="rl-roadmap">
          {[
            [
              "Share the source",
              "Send your drawings, dimensions and references.",
            ],
            [
              "Agree the scope",
              "Confirm deliverables, pricing, revisions and delivery in writing.",
            ],
            ["Review the design", "Share feedback against the agreed stages."],
            [
              "Receive the final work",
              "Get your agreed digital files in the confirmed formats.",
            ],
          ].map(([t, d], i) => (
            <div key={t}>
              <span>{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="rl-faq">
          <details>
            <summary>{s.faq}</summary>
            <p>{s.answer}</p>
          </details>
        </div>
      </section>
      <section className="rl-final">
        <div className="rl-shell">
          <h2>Start with the service you need.</h2>
          <EnquiryLink
            className="rl-button"
            number={number}
            message={`Hello RenderLine Studio, please quote ${s.title} for my project.`}
          >
            Discuss {s.title.toLowerCase()}
          </EnquiryLink>
        </div>
      </section>
    </div>
  );
}
