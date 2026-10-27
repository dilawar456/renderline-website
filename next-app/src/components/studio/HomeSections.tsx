import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  House,
  FileImage,
  Handshake,
  Building2,
  Sofa,
  Box,
  Clapperboard,
  Ruler,
  MessagesSquare,
  Layers,
  FileCheck2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { SERVICES, type PublicWork } from "@/lib/services";
import { type Pricing, money } from "@/lib/pricing";
import { servicePrice } from "@/lib/service-price";
import { optimizeCloudinaryUrl } from "@/lib/media";
import EnquiryLink from "./EnquiryLink";
const icons = {
  "house-plans": House,
  "front-elevation": Building2,
  "interior-design": Sofa,
  "drawing-booklets": Ruler,
  "exterior-visualization": Building2,
  "3d-modeling": Box,
  "walkthrough-animation": Clapperboard,
};
export function ServiceIcon({
  slug,
  size = 24,
}: {
  slug: string;
  size?: number;
}) {
  const Icon = icons[slug as keyof typeof icons] || Box;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
export function ClientPathways({ items }: { items: PublicWork[] }) {
  const paths = [
    {
      title: "Building a home?",
      text: "Start with your floor plan and front elevation.",
      action: "Design my home",
      href: "/start-project?service=house-plans",
      id: 150,
      Icon: House,
    },
    {
      title: "Already have drawings?",
      text: "See your interior or exterior in realistic 3D.",
      action: "Visualize my project",
      href: "/start-project?service=exterior-visualization",
      id: 183,
      Icon: FileImage,
    },
    {
      title: "Architect or developer?",
      text: "Bring your design. We handle the visualization.",
      action: "Work with our studio",
      href: "#professionals",
      id: 164,
      Icon: Handshake,
    },
  ];
  return (
    <section
      className="mission-paths rl-shell"
      aria-labelledby="pathways-title"
    >
      <h2 id="pathways-title">What do you need?</h2>
      <div className="mission-path-grid">
        {paths.map((p) => {
          const image = items.find((i) => Number(i.id) === p.id);
          return (
            <Link className="mission-path" href={p.href} key={p.title}>
              <div className="mission-path-photo">
                {image && (
                  <Image
                    src={optimizeCloudinaryUrl(image.image_url, 500)}
                    alt={
                      p.title === "Building a home?"
                        ? "RenderLine 3D floor plan study"
                        : "RenderLine visualization example"
                    }
                    fill
                    sizes="(max-width:700px) 96px, 28vw"
                  />
                )}
              </div>
              <div className="mission-path-copy">
                <p className="mission-path-title">
                  <p.Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  {p.title}
                </p>
                <p>{p.text}</p>
                <span>
                  {p.action}
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
export function SelectedWork({ items }: { items: PublicWork[] }) {
  const selected = [
    { id: 187, label: "Residential exterior" },
    { id: 188, label: "Interior visualization" },
    { id: 186, label: "3D front elevation" },
    { id: 164, label: "Commercial visualization" },
  ];
  return (
    <section className="mission-work rl-section rl-shell" id="work">
      <div className="mission-section-heading">
        <h2>Selected work.</h2>
        <Link className="rl-text-link" href="/portfolio">
          Explore full portfolio{" "}
          <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
      <div className="mission-work-grid">
        {selected.flatMap((p) => {
          const item = items.find((i) => Number(i.id) === p.id);
          return item
            ? [
                <Link
                  key={p.id}
                  className="mission-project"
                  href={"/portfolio/" + item.id}
                  aria-label={"View " + p.label.toLowerCase()}
                >
                  <div className="mission-project-image">
                    <Image
                      src={optimizeCloudinaryUrl(item.image_url, 1000)}
                      alt={p.label + " by RenderLine Studio"}
                      fill
                      sizes="(max-width:600px) 45vw, 47vw"
                    />
                  </div>
                  <div className="mission-project-caption">
                    <span>{p.label}</span>
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </Link>,
              ]
            : [];
        })}
      </div>
    </section>
  );
}
export function HomeServiceIndex({ pricing: p }: { pricing: Pricing }) {
  return (
    <section className="mission-services rl-section rl-shell" id="services">
      <div className="mission-section-heading">
        <div>
          <h2>Services & guide prices.</h2>
          <p>Choose one service or a complete package.</p>
        </div>
        <Link className="rl-text-link" href="/pricing">
          Compare packages{" "}
          <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
      <div className="mission-service-list">
        {SERVICES.map((s) => (
          <Link
            key={s.slug}
            href={"/services/" + s.slug}
            className="mission-service-row"
          >
            <ServiceIcon slug={s.slug} />
            <div>
              <h3>
                {s.slug === "house-plans"
                  ? "House plans"
                  : s.slug === "drawing-booklets"
                    ? "Architectural booklets"
                    : s.slug === "walkthrough-animation"
                      ? "Architectural animation"
                      : s.title}
              </h3>
              <p>
                {s.slug === "house-plans"
                  ? `${money(p.floorPlan.upTo10)} / up to 10 marla, 2 storeys total`
                  : servicePrice(s.slug, p)}
              </p>
            </div>
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ))}
      </div>
      <div className="mission-service-foot">
        <p>
          PKR guide rates. Scope and deliverables confirmed in your quotation.
        </p>
        <Link className="rl-text-link" href="/pricing#budget-estimator">
          Estimate my budget
        </Link>
      </div>
    </section>
  );
}
export function HomeProcess() {
  return (
    <section className="mission-process rl-section rl-shell" id="how-it-works">
      <div className="mission-section-heading">
        <h2>How it works.</h2>
        <Link className="rl-text-link" href="/process">
          See the full process{" "}
          <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
      <ol>
        {[
          {
            Icon: MessagesSquare,
            title: "Share your requirements",
            text: "Send your plot dimensions, drawings or references.",
          },
          {
            Icon: Layers,
            title: "We design & visualize",
            text: "Review the plans, details and views in your agreed scope.",
          },
          {
            Icon: FileCheck2,
            title: "Review & receive",
            text: "Share feedback and receive the agreed digital files.",
          },
        ].map((s) => (
          <li key={s.title}>
            <s.Icon size={28} strokeWidth={1.5} aria-hidden="true" />
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function StudioTrust({
  image,
  number,
}: {
  image: string;
  number: string;
}) {
  return (
    <section className="mission-studio rl-section rl-shell" id="professionals">
      <div className="mission-studio-image">
        <Image
          src={optimizeCloudinaryUrl(image, 750)}
          alt="Dilawar Ali, RenderLine Studio"
          fill
          sizes="(max-width:700px) 86vw, 35vw"
        />
      </div>
      <div className="mission-studio-copy">
        <h2>
          Built around
          <br />
          your project.
        </h2>
        <p>
          Led by Dilawar Ali in Lahore. Working with homeowners, architects and
          design teams.
        </p>
        <ul>
          {[
            {
              Icon: CheckCircle2,
              title: "Clear scope",
              text: "Drawings, views and revisions agreed before work starts.",
            },
            {
              Icon: MessagesSquare,
              title: "Project communication",
              text: "Feedback and deliverables in your invited project workspace.",
            },
            {
              Icon: Handshake,
              title: "Studio collaboration",
              text: "Single projects or a tailored package for recurring work.",
            },
          ].map((s) => (
            <li key={s.title}>
              <s.Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="rl-actions">
          <EnquiryLink
            className="rl-button"
            number={number}
            message="Hello RenderLine Studio, I am an architect or developer and would like to discuss project visualization and a studio collaboration package."
          >
            Work with our studio{" "}
            <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
          </EnquiryLink>
          <Link className="rl-text-link" href="/about">
            Meet the studio
          </Link>
        </div>
      </div>
    </section>
  );
}
export function FinalEnquiry({ number }: { number: string }) {
  return (
    <section className="mission-enquiry rl-shell">
      <div>
        <h2>Have a project in mind?</h2>
        <p>Share your drawings or ideas. Let’s make a start.</p>
      </div>
      <EnquiryLink
        className="rl-button"
        number={number}
        message="Hello RenderLine Studio, I would like to discuss my project and confirm the service, scope and quotation."
      >
        <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
        Discuss on WhatsApp
      </EnquiryLink>
    </section>
  );
}
