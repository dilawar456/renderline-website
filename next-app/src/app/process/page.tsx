import type { Metadata } from "next";
import Link from "next/link";
import { PlanningRoadmap } from "@/components/studio/StudioSections";

export const metadata: Metadata = {
  title: "Our Design & Visualization Process",
  description: "See how RenderLine Studio moves from your requirements and floor plans to architectural details, 3D visuals and agreed digital deliverables.",
  alternates: { canonical: "/process" },
};
export default function ProcessPage() {
  return (
    <div className="rl-site">
      <section className="rl-page-intro rl-shell">
        <h1>From your brief<br />to your finished files.</h1>
        <p>Our planning and architectural booklet workflow. For a single visualization or another service, we agree the relevant stages in your quotation.</p>
      </section>
      <section className="rl-process-section rl-section">
        <div className="rl-shell">
          <h2>A clear route through your project.</h2>
          <PlanningRoadmap />
          <div className="rl-actions">
            <Link className="rl-button" href="/start-project">Discuss your project</Link>
            <Link className="rl-text-link" href="/pricing">Explore services &amp; prices</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
