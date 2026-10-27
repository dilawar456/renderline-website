import type { Metadata } from "next";
import { getSiteContent } from "@/lib/public-data";
import { validSamples } from "@/lib/drawing-samples";
import { publicWhatsAppNumber } from "@/lib/public-contact";
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
    <div className="rl-site">
      <section className="rl-page-intro rl-shell">
        <h1>
          Know what your
          <br />
          drawing package contains.
        </h1>
        <p>
          Browse working-drawing, structure and submission sample options by
          plot size. Published documents include readable image previews and the
          full sample PDF.
        </p>
      </section>
      <section className="rl-shell rl-section" style={{ paddingTop: 15 }}>
        <DrawingSamples
          samples={samples}
          number={publicWhatsAppNumber(c?.contact_whatsapp)}
        />
      </section>
    </div>
  );
}
