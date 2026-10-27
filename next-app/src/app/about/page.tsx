import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent, optimizeCloudinaryUrl } from "@/lib/public-data";
export const metadata: Metadata = {
  title: "About RenderLine Studio",
  description:
    "RenderLine Studio, led by Dilawar Ali in Lahore, creates house plans, architectural drawings and 3D visualizations for homeowners and design professionals.",
  alternates: { canonical: "/about" },
};
export const revalidate = 60;
export default async function AboutPage() {
  const { data: c } = await getSiteContent();
  const image = c?.about_image || "/assets/dilawar-ali.jpg";
  return (
    <div className="rl-site">
      <section className="rl-service-hero rl-shell">
        <div>
          <p className="rl-location">Meet the studio</p>
          <h1>
            Clear drawings.
            <br />
            Considered visuals.
          </h1>
          <p>
            RenderLine Studio is led by Dilawar Ali in Lahore, Pakistan. We help
            homeowners develop their house plans and help architects, developers
            and design firms communicate their projects in 3D.
          </p>
          <p>
            Our work spans floor plans, architectural working booklets, front
            elevations, interior and exterior visualization, 3D modeling and
            pre-rendered walkthrough videos.
          </p>
          <Link className="rl-button" href="/start-project">
            Discuss your project
          </Link>
        </div>
        <div className="rl-detail-image" style={{ aspectRatio: 1 }}>
          <Image
            src={optimizeCloudinaryUrl(image, 900)}
            alt="Dilawar Ali, RenderLine Studio"
            fill
            priority
            sizes="(max-width:600px) 90vw, 45vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>
      <section className="rl-section rl-shell rl-deliverables">
        <div>
          <h2>For the person building a home.</h2>
          <p>
            We make room arrangements, drawing packages and design choices
            easier to understand. Start with a plot, dimensions and the spaces
            you need.
          </p>
          <Link className="rl-text-link" href="/services/house-plans">
            Explore house plans
          </Link>
        </div>
        <div>
          <h2>For the professional presenting a design.</h2>
          <p>
            Share your plans, model and references. We agree the scope, review
            stages and final outputs so you can present your design intent
            clearly.
          </p>
          <Link
            className="rl-text-link"
            href="/services/exterior-visualization"
          >
            Explore visualization services
          </Link>
        </div>
      </section>
      <section className="rl-final">
        <div className="rl-shell">
          <div>
            <h2>Real work. Clear scope.</h2>
            <p>
              See our portfolio and compare the service options before you
              start.
            </p>
          </div>
          <Link className="rl-button" href="/portfolio">
            Explore the portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}
