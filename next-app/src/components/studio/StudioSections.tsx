import Image from "next/image";
import Link from "next/link";
import { SERVICES, workMatches, type PublicWork } from "@/lib/services";
import { servicePrice } from "@/lib/service-price";
import type { Pricing } from "@/lib/pricing";
import { optimizeCloudinaryUrl } from "@/lib/media";
import EnquiryLink from "./EnquiryLink";
export function ServiceCards({
  items,
  pricing,
  number,
  compact = false,
}: {
  items: PublicWork[];
  pricing: Pricing;
  number: string;
  compact?: boolean;
}) {
  return (
    <div className="rl-services-grid">
      {SERVICES.filter((s) => !compact || s.slug !== "3d-modeling").map((s) => {
        const item = items.find((i) => workMatches(i, s.category));
        return (
          <article key={s.slug} className="rl-service-card">
            <Link
              className="rl-service-visual"
              href={"/services/" + s.slug}
              aria-label={`Explore ${s.title}`}
            >
              {item ? (
                <Image
                  src={optimizeCloudinaryUrl(item.image_url, 650)}
                  alt={`${s.title} — genuine RenderLine portfolio example`}
                  fill
                  sizes="(max-width: 650px) 90vw, (max-width: 1000px) 45vw, 30vw"
                />
              ) : (
                <div className="rl-drawing-index">
                  <span>Architectural booklet</span>
                  <div>Plans</div>
                  <div>Elevations</div>
                  <div>Sections & details</div>
                  <small>Drawing index agreed to your project</small>
                </div>
              )}
            </Link>
            <div className="rl-service-copy">
              <h3>
                <Link href={"/services/" + s.slug}>{s.title}</Link>
              </h3>
              <p>{s.short}</p>
              <strong className="rl-service-price">
                {servicePrice(s.slug, pricing)}
              </strong>
              <div className="rl-card-actions">
                <Link href={"/services/" + s.slug}>Explore service</Link>
                <EnquiryLink
                  number={number}
                  message={`Hello RenderLine Studio, I would like a quote for ${s.title}.`}
                >
                  Get quote
                </EnquiryLink>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
export function PlanningRoadmap() {
  const steps = [
    [
      "Share your plot",
      "Send dimensions, road-facing side, location, required floors and room needs.",
    ],
    [
      "Plan the spaces",
      "Review rooms, kitchen, stairs, bathrooms, circulation and parking.",
    ],
    [
      "Review the layout",
      "Agree the planning direction before the relevant detailed drawings begin.",
    ],
    [
      "See it in 3D",
      "Review the front elevation, materials and appearance. Included with the residential booklet.",
    ],
    [
      "Detail the drawings",
      "Confirm the drawing index: plans, elevations, sections and required details. Specialist disciplines are separate.",
    ],
    [
      "Receive your files",
      "Review and receive the digital drawings and visuals in the formats agreed in your quotation.",
    ],
  ];
  return (
    <div className="rl-roadmap">
      {steps.map(([title, text], i) => (
        <div key={title}>
          <span>{i + 1}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </div>
  );
}
export function StudioFaq() {
  return (
    <div className="rl-faq">
      {[
        [
          "Can I order just one service?",
          "Yes. Order only a floor plan, elevation, interior, working drawing or visualization service. You do not need to buy a full package.",
        ],
        [
          "What is included in a standalone house plan?",
          "Dimensioned floor plans for up to two storeys within the selected plot-size band. Furniture layouts and the rest of the architectural working details are excluded.",
        ],
        [
          "Are the prices only for architects and firms?",
          "No. The same published studio partner guide rates are available to direct clients. Recurring work and project batches can receive a tailored volume quotation.",
        ],
        [
          "How many revisions and how long will it take?",
          "We agree revision rounds, deliverable formats and the schedule after reviewing the scope. They are confirmed in the written quotation before work begins.",
        ],
        [
          "Do the packages include structure or authority approval?",
          "Structure and submission drawings are separate services. Authority fees, stamping and approval are not included or guaranteed.",
        ],
        [
          "Can I send existing drawings or a 3D model?",
          "Yes. Share CAD/PDF drawings, models, photographs and references in WhatsApp or through your invited client portal. File compatibility and source-file delivery are agreed before work.",
        ],
      ].map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
