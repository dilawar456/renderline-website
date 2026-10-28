import { publicMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import PortfolioArtwork from "@/components/studio/PortfolioArtwork";
import { getPortfolioItems } from "@/lib/public-data";
import { PageAction } from "@/components/studio/InnerPage";

export const metadata: Metadata = publicMetadata({
  title: "Our Design & Visualization Process",
  description: "See how RenderLine Studio moves from your requirements and floor plans to architectural details, 3D visuals and agreed digital deliverables.",
  alternates: { canonical: "/process" },
});
export default async function ProcessPage() {
  const { data: work } = await getPortfolioItems();
  const stages = [
    ["Share your starting point", "Send plot dimensions, drawings, location and references. Tell us the spaces, floors or views you need.", "Your brief"],
    ["Agree the scope", "Confirm the services, drawing index, review stages and deliverable formats in your quotation.", "A clear quotation"],
    ["Develop the layout", "Review room planning, circulation, stairs and parking for a planning package. Existing designs start at the relevant visualization stage.", "Planning direction"],
    ["Bring the design to life", "Review the agreed 3D views, materials and appearance. Front elevation is included with the residential architectural booklet.", "Design review"],
    ["Resolve the details", "Complete the agreed architectural details or working drawings. Structure and submission remain separate services.", "Coordinated drawings"],
    ["Review and receive", "Share final feedback and receive the agreed digital files through your project communication channel.", "Your deliverables"],
  ];
  return <div className="rl-site edition-process rl-shell edition-page"><header className="atelier-process-header"><div><Link href="/" className="edition-back">RenderLine Studio / Process</Link><h1>From an idea.<br /><em>To a real space.</em></h1></div><div><span className="atelier-label">Six considered stages</span><p>A shared brief, a clear scope and room for review. Follow the stages relevant to your planning or visualization project.</p><a href="#design-stages" className="rl-text-link">Explore the process ↗</a></div></header><div className="atelier-process-pair"><PortfolioArtwork items={work || []} preferred={150} category="floorplan" caption="A floor-plan visualization study" /><PortfolioArtwork items={work || []} preferred={187} category="exterior" caption="An exterior visualization study" /></div><div className="edition-timeline" id="design-stages">{stages.map(([title,text,output],i)=><article key={title}><span className="edition-stage-number">{String(i+1).padStart(2,"0")}</span><div><h2>{title}</h2><p>{text}</p></div><span className="edition-stage-output">{output}</span></article>)}</div><PageAction title="Ready for the first step?" text="A plot, an existing drawing or an idea is enough to start the conversation." href="/start-project" action="Build your project brief" /></div>;
}
