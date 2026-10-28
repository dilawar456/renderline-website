import { publicMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { PageHeading, PageAction } from "@/components/studio/InnerPage";

export const metadata: Metadata = publicMetadata({
  title: "Our Design & Visualization Process",
  description: "See how RenderLine Studio moves from your requirements and floor plans to architectural details, 3D visuals and agreed digital deliverables.",
  alternates: { canonical: "/process" },
});
export default function ProcessPage() {
  const stages = [
    ["Share your starting point", "Send plot dimensions, drawings, location and references. Tell us the spaces, floors or views you need.", "Your brief"],
    ["Agree the scope", "Confirm the services, drawing index, review stages and deliverable formats in your quotation.", "A clear quotation"],
    ["Develop the layout", "Review room planning, circulation, stairs and parking for a planning package. Existing designs start at the relevant visualization stage.", "Planning direction"],
    ["Bring the design to life", "Review the agreed 3D views, materials and appearance. Front elevation is included with the residential architectural booklet.", "Design review"],
    ["Resolve the details", "Complete the agreed architectural details or working drawings. Structure and submission remain separate services.", "Coordinated drawings"],
    ["Review and receive", "Share final feedback and receive the agreed digital files through your project communication channel.", "Your deliverables"],
  ];
  return <div className="rl-site edition-process rl-shell edition-page"><PageHeading title="A considered process. A clear next step." description="Our planning and architectural booklet workflow. Single-service projects use the relevant stages, confirmed in your quotation." /><div className="edition-timeline">{stages.map(([title,text,output],i)=><article key={title}><span className="edition-stage-number">{String(i+1).padStart(2,"0")}</span><div><h2>{title}</h2><p>{text}</p></div><span className="edition-stage-output">{output}</span></article>)}</div><PageAction title="Ready for the first step?" text="A plot, an existing drawing or an idea is enough to start the conversation." href="/start-project" action="Build your project brief" /></div>;
}
