import type { Metadata } from "next";
import { getSiteContent } from "@/lib/public-data";
import { validSamples } from "@/lib/drawing-samples";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import { PageHeading } from "@/components/studio/InnerPage";
import DrawingSamples from "@/components/studio/DrawingSamples";
export const metadata: Metadata = {
  title: "Working Drawing, Structure & Submission Samples",
  description:
    "Explore standard plot drawing sample options, ground and first floor layouts, structural and submission sample PDFs with page previews.",
  alternates: { canonical: "/drawing-samples" },
};
export const revalidate = 60;
export default async function SamplesPage() {
  const { data: c } = await getSiteContent();
  const samples = validSamples(c?.drawing_samples) ? c.drawing_samples : [];
  return (
    <div className="rl-site edition-samples">
      <div className="rl-shell edition-page"><PageHeading title="Inside the drawing set." description="Explore architectural working, structure and submission samples. Choose the discipline and plot size to find the relevant output." /><div className="edition-document-types"><span>Filter by drawing discipline</span><span>Match your plot size</span><span>Review the sample output</span></div></div>
      <section className="rl-shell rl-section" style={{ paddingTop: 15 }}>
        <DrawingSamples
          samples={samples}
          number={publicWhatsAppNumber(c?.contact_whatsapp)}
        />
      </section>
    </div>
  );
}
