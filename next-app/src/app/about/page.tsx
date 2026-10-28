import { publicMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "@/components/studio/RenderImage";
import Link from "next/link";
import { PageAction } from "@/components/studio/InnerPage";
import { getSiteContent, optimizeCloudinaryUrl } from "@/lib/public-data";
export const metadata: Metadata = publicMetadata({
  title: "About RenderLine Studio",
  description:
    "RenderLine Studio, led by Dilawar Ali in Lahore, creates house plans, architectural drawings and 3D visualizations for homeowners and design professionals.",
  alternates: { canonical: "/about" },
});
export const revalidate = 60;
export default async function AboutPage() {
  const { data: c } = await getSiteContent();
  const image = c?.about_image || "/assets/dilawar-ali.jpg";
  return (
    <div className="rl-site edition-about rl-shell edition-page">
      <header className="edition-about-title"><Link href="/" className="edition-back">RenderLine Studio / About</Link><h1>Ideas into spaces.<br /><em>Detail into reality.</em></h1></header>
      <section className="edition-about-story">
        <figure><div className="edition-portrait"><Image src={optimizeCloudinaryUrl(image, 1000)} alt="Dilawar Ali, RenderLine Studio" fill priority sizes="(max-width:700px) 90vw,40vw" /></div><figcaption>Dilawar Ali <span>RenderLine Studio · Lahore, Pakistan</span></figcaption></figure>
        <div><h2>A studio for the way<br />you see your project.</h2><p>Led by Dilawar Ali, RenderLine works with homeowners, architects, developers and design teams. We turn plot requirements into considered plans and existing designs into realistic visuals.</p><p>Our work spans floor plans, architectural drawing booklets, elevations, interior and exterior visualization, 3D modeling and walkthrough films.</p><Link href="/portfolio" className="rl-text-link">See the work ↗</Link><div className="edition-principles"><article><span>01</span><h3>Clarity before detail</h3><p>Agree the drawing index, views, revisions and deliverables before work begins.</p></article><article><span>02</span><h3>Design, in context</h3><p>Work from your actual dimensions, references and intended use.</p></article><article><span>03</span><h3>One conversation</h3><p>Keep feedback and project files together in your invited workspace.</p></article></div></div>
      </section>
      <section className="edition-audiences"><article><h2>Building a home?</h2><p>Start with your plot, dimensions and the spaces you need.</p><Link href="/services/house-plans" className="rl-text-link">Explore house plans ↗</Link></article><article><h2>Presenting a design?</h2><p>Bring your drawings, model and references. We handle the visualization.</p><Link href="/services/exterior-visualization" className="rl-text-link">Explore visualization ↗</Link></article></section>
      <PageAction title="Let’s work on your next space." text="One service or a coordinated package. Start with what you have." href="/start-project" action="Discuss your project" />
    </div>
  );
}
