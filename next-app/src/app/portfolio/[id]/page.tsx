import { publicMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "@/components/studio/RenderImage";
import Link from "next/link";
import {
  getPortfolioItems,
  getSiteContent,
  optimizeCloudinaryUrl,
} from "@/lib/public-data";
import { PORTFOLIO_CATEGORIES, serviceHref, workMatches } from "@/lib/services";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import EnquiryLink from "@/components/studio/EnquiryLink";
export const revalidate = 60;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: items } = await getPortfolioItems();
  const item = items?.find(i => String(i.id) === id);
  if (!item) notFound();
  const label = PORTFOLIO_CATEGORIES.find(c => c.key !== "all" && workMatches(item, c.key))?.label || "Architectural visualization";
  return publicMetadata({
    title: label + " - Portfolio example " + id,
    description:
      "A genuine RenderLine portfolio visualization. Discuss a similar design and review service scope.",
    alternates: { canonical: "/portfolio/" + id },
  });
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params,
    [{ data: items }, { data: c }] = await Promise.all([
      getPortfolioItems(),
      getSiteContent(),
    ]);
  const item = items?.find((i) => String(i.id) === id);
  if (!item) notFound();
  const category = /elevation/i.test(item.title)
    ? "elevation"
    : (item.category || "exterior").split("|")[0];
  const label =
    PORTFOLIO_CATEGORIES.find((c) => c.key === category)?.label ||
    "Architectural visualization";
  const related = (items || [])
    .filter((i) => i.id !== item.id && workMatches(i, category))
    .slice(0, 3);
  return (
    <div className="rl-site edition-project-detail">
      <section className="edition-project-heading rl-shell">
        <Link className="rl-text-link" href={"/portfolio?category=" + category}>
          Back to {label.toLowerCase()}
        </Link>
        <div className="edition-project-title"><div><span className="atelier-label">RenderLine portfolio study</span><h1>{label}.</h1></div><Link className="rl-button" href={"/start-project?service=" + serviceHref(category).replace("/services/", "")}>Plan a similar project ↗</Link></div>
        <p>
          A RenderLine portfolio example. Share the features you like so we can
          quote a project-specific scope.
        </p>
      </section>
      <div className="rl-shell atelier-project-canvas">
        <a
          href={item.image_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open full-resolution portfolio image"
        >
          <Image
            src={optimizeCloudinaryUrl(item.image_url, 1800)}
            alt={`RenderLine ${label.toLowerCase()} portfolio visualization`}
            width={1800}
            height={1200}
            sizes="90vw"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "85vh",
              objectFit: "contain",
              background: "var(--ui-panel)",
            }}
            priority
          />
        </a>
        <p className="rl-note edition-image-hint">Select the image to open the full-resolution original.</p>
      </div>
      <section className="rl-section rl-shell rl-deliverables">
        <div>
          <h2>Plan a similar project.</h2>
          <p>
            The modeling, views, drawing details and file formats for your
            project are agreed separately. Portfolio images illustrate
            visualization quality; they do not define every package deliverable.
          </p>
          <Link className="rl-text-link" href={serviceHref(category)}>
            See the related service & scope
          </Link>
        </div>
        <div className="rl-scope-box">
          <h3>Send this example with your brief.</h3>
          <EnquiryLink
            className="rl-button"
            number={publicWhatsAppNumber(c?.contact_whatsapp)}
            message={`Hello RenderLine Studio, I would like to discuss a project inspired by this portfolio example: https://renderline.pk/portfolio/${item.id}. Please confirm the scope and quote.`}
          >
            Discuss my project
          </EnquiryLink>
          <p>
            <Link className="rl-text-link" href="/pricing">
              Explore service pricing
            </Link>
          </p>
        </div>
      </section>
      {related.length > 0 && (
        <section className="rl-work-section rl-section">
          <div className="rl-shell">
            <h2>Related work.</h2>
            <div className="rl-work-grid" style={{ marginTop: 25 }}>
              {related.map((i) => (
                <Link key={i.id} href={"/portfolio/" + i.id}>
                  <Image
                    src={optimizeCloudinaryUrl(i.image_url, 750)}
                    fill
                    alt={`Related ${label.toLowerCase()} example`}
                    sizes="(max-width:600px) 45vw, 30vw"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
