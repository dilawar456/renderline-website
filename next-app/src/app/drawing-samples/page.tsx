import { publicMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import PortfolioArtwork from "@/components/studio/PortfolioArtwork";
import { getPortfolioItems, getSiteContent } from "@/lib/public-data";
import { validSamples } from "@/lib/drawing-samples";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import Link from "next/link";
import DrawingSamples from "@/components/studio/DrawingSamples";
export const metadata: Metadata = publicMetadata({
  title: "Working Drawing, Structure & Submission Samples",
  description:
    "Explore standard plot drawing sample options, ground and first floor layouts, structural and submission sample PDFs with page previews.",
  alternates: { canonical: "/drawing-samples" },
});
export const revalidate = 60;
export default async function SamplesPage() {
  const [{ data: c }, { data: work }] = await Promise.all([getSiteContent(), getPortfolioItems()]);
  const samples = validSamples(c?.drawing_samples) ? c.drawing_samples : [];
  return (
    <div className="rl-site edition-samples">
      <header className="rl-shell edition-page atelier-library-intro"><div><Link href="/" className="edition-back">RenderLine Studio / Drawing samples</Link><h1>Inside the<br /><em>drawing set.</em></h1><p>Explore architectural working, structure and submission samples. Choose a discipline and plot size to find the relevant output.</p><a className="rl-button" href="#sample-library">Find your sample ↗</a><span className="atelier-lead-note">Portfolio study shown · Sample PDFs are requested separately</span></div><PortfolioArtwork items={work || []} preferred={150} category="floorplan" caption="Floor-plan visualization study" className="atelier-plan-art" priority /></header>
      <section className="rl-shell rl-section" id="sample-library" style={{ paddingTop: 15 }}>
        <DrawingSamples
          samples={samples}
          number={publicWhatsAppNumber(c?.contact_whatsapp)}
        />
      </section>
    </div>
  );
}
