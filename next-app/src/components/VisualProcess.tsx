'use client';

import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { optimizeCloudinaryUrl } from '@/lib/media';
import './visual-process.css';
import './service-flow.css';

type Stage = { title: string; owner: 'CLIENT' | 'RENDERLINE'; text: string; handoff: string };
type Service = { id: string; name: string; input: string; art: string; stages: Stage[] };

const services: Service[] = [
  {
    id: 'exterior', name: '3D Front Elevation', art: 'exterior',
    input: 'Floor plan or a rough, dimensioned sketch; renovation photos if applicable; one or more style references.',
    stages: [
      { title: 'Your brief', owner: 'CLIENT', text: 'Share the plan, main dimensions and site photos. Add modern, classic or mixed references and tell us what to take from each.', handoff: 'Plan + photos + references' },
      { title: 'Rough direction', owner: 'RENDERLINE', text: 'We build the basic 3D mass from the plan and show a draft façade. You choose the direction before detail work.', handoff: 'Basic model + draft view' },
      { title: 'Detailed model', owner: 'RENDERLINE', text: 'We refine the façade, apply agreed reference elements, then add materials and lighting for review.', handoff: 'Detailed model + material preview' },
      { title: 'Final render', owner: 'RENDERLINE', text: 'After your consolidated feedback, we render and check the approved exterior views.', handoff: 'Final exterior images' },
    ],
  },
  {
    id: 'interior', name: 'Interior Design', art: 'interior',
    input: 'Room plan and dimensions, photos if existing, plus furniture, ceiling, wall, media wall and wardrobe references.',
    stages: [
      { title: 'Plan + references', owner: 'CLIENT', text: 'Send the room plan and measurements. Mark the reference images for furniture, ceiling, walls, media wall and wardrobe.', handoff: 'Measured plan + references' },
      { title: 'Moodboard + base', owner: 'RENDERLINE', text: 'We pin every reference to the plan with leader lines, agree the final moodboard, then block out a basic 3D model.', handoff: 'Approved moodboard + basic model' },
      { title: 'Detailed model', owner: 'RENDERLINE', text: 'The approved furniture, joinery, ceiling and finishes become a detailed model with materials and lighting.', handoff: 'Detailed model + draft views' },
      { title: 'Final render', owner: 'RENDERLINE', text: 'We incorporate agreed feedback and render the selected interior views.', handoff: 'Final interior images' },
    ],
  },
  {
    id: 'drawings', name: 'Architectural Drawings', art: 'drawings',
    input: 'Plot outer dimensions, orientation and room requirements; any survey, sketch or existing plan available.',
    stages: [
      { title: 'Plot dimensions', owner: 'CLIENT', text: 'Share a rough plot sketch with the main outer dimensions, orientation and space requirements.', handoff: 'Dimensioned plot brief' },
      { title: 'Floor plan', owner: 'RENDERLINE', text: 'We prepare the layout and furniture arrangement within the confirmed dimensions, then review it with you.', handoff: 'Draft floor plan' },
      { title: 'Drawing set', owner: 'RENDERLINE', text: 'We develop elevations, sections and working drawings with detailed dimensions and relevant MEP coordination.', handoff: 'Detailed drawing booklet draft' },
      { title: 'Final booklet', owner: 'RENDERLINE', text: 'After your review, we coordinate the sheets and deliver the agreed booklet and file formats.', handoff: 'Final drawing package' },
    ],
  },
  {
    id: 'walkthrough', name: '3D Walkthrough', art: 'walkthrough',
    input: 'Approved plans or model, reference style, areas to feature and preferred video length.',
    stages: [
      { title: 'Approved design', owner: 'CLIENT', text: 'Confirm the design, materials and spaces to show. Tell us the story the walkthrough should communicate.', handoff: 'Model + video brief' },
      { title: 'Camera route', owner: 'RENDERLINE', text: 'We map the shots and create a low-detail animated preview for timing and route approval.', handoff: 'Storyboard + preview' },
      { title: 'Detailed scenes', owner: 'RENDERLINE', text: 'We finish models, materials, lighting and camera movement after the route is approved.', handoff: 'Detailed scenes + test frames' },
      { title: 'Final film', owner: 'RENDERLINE', text: 'The approved shots are rendered, edited and delivered in the agreed video format.', handoff: 'Final walkthrough video' },
    ],
  },
  {
    id: 'plans', name: 'Floor Plan Visuals', art: 'plans',
    input: 'CAD plan or dimensioned sketch, room names, furniture needs and preferred graphic style.',
    stages: [
      { title: 'Plan input', owner: 'CLIENT', text: 'Send the plan or rough dimensions and tell us how each room should function.', handoff: 'Plan + room brief' },
      { title: 'Layout draft', owner: 'RENDERLINE', text: 'We check scale, room connections and furniture placement in a readable draft.', handoff: 'Annotated layout' },
      { title: 'Detailed plan', owner: 'RENDERLINE', text: 'We add furniture, surfaces, labels and the agreed 2D or 3D presentation style.', handoff: 'Detailed plan preview' },
      { title: 'Final sheets', owner: 'RENDERLINE', text: 'After review, we export the approved plan visuals for your presentation.', handoff: 'Final plan images or PDF' },
    ],
  },
  {
    id: 'consultation', name: 'Design Consultation', art: 'consultation',
    input: 'Current plans or photos, your goals, constraints and the questions you want answered.',
    stages: [
      { title: 'Share context', owner: 'CLIENT', text: 'Send drawings, photos and a short list of design decisions you need help making.', handoff: 'Project brief + questions' },
      { title: 'Review', owner: 'RENDERLINE', text: 'We study the layout, references, practical constraints and potential directions.', handoff: 'Initial recommendations' },
      { title: 'Refine options', owner: 'RENDERLINE', text: 'We discuss options, mark up the preferred direction and clarify next steps.', handoff: 'Annotated direction' },
      { title: 'Action plan', owner: 'RENDERLINE', text: 'You receive an organized summary of the agreed decisions and deliverables.', handoff: 'Consultation summary' },
    ],
  },
];

export function PlanArt({ kind, stage }: { kind: string; stage: number }) {
  const isInterior = kind === 'interior';
  const isDrawings = kind === 'drawings' || kind === 'plans';
  const isExterior = kind === 'exterior';
  if (stage === 3 && isDrawings) {
    return <svg className="vp-svg vp-svg-enter" viewBox="0 0 600 350" role="img" aria-label="Illustrated final drawing booklet with plan, elevation, section and MEP sheets">
      <g className="vp-sheet-stack"><rect x="115" y="54" width="320" height="228" rx="5"/><rect x="137" y="70" width="320" height="228" rx="5"/><rect x="159" y="86" width="320" height="228" rx="5"/></g>
      <text x="180" y="119" className="vp-svg-small">DRAWING BOOKLET</text><path d="M180 131H454"/>
      <rect x="182" y="150" width="113" height="124" fill="none"/><path d="M182 190H295M224 150V274M224 226H295M260 190V274"/>
      <path d="M322 162L373 139L433 163V233L373 254L322 232Z M322 190L373 169L433 191M373 169V254" fill="none"/>
      <text x="184" y="294" className="vp-svg-tiny">PLAN</text><text x="324" y="294" className="vp-svg-tiny">ELEVATION · SECTION · MEP</text>
    </svg>;
  }
  if (stage === 3) {
    return <svg className="vp-svg vp-svg-enter" viewBox="0 0 600 350" role="img" aria-label="Illustrated final design presentation">
      <rect x="78" y="38" width="444" height="274" rx="7" className="vp-art-frame"/>
      <path d="M98 267H502M132 267V180L301 92L468 180V267M157 172L301 99L443 172M161 189H439M202 189V267M301 134V267M398 189V267" fill="none"/>
      <path d="M222 204H273V248H222ZM324 204H377V248H324Z" fill="none"/>
      <circle cx="455" cy="92" r="19" className="vp-art-sun"/><text x="101" y="293" className="vp-svg-small">FINAL PRESENTATION</text>
    </svg>;
  }
  if (stage === 2) {
    return <svg className="vp-svg vp-svg-enter" viewBox="0 0 600 350" role="img" aria-label="Illustrated detailed 3D model with materials and lighting">
      <path d="M116 229L289 151L457 216L283 296Z M116 229V105L289 40L457 105V216M116 105L283 167L457 105M283 167V296M160 122V234M202 140V255M244 158V275M325 149V276M368 132V260M412 115V239" fill="none"/>
      <path d="M127 169L271 222M127 204L271 257M297 222L445 169M297 257L445 204" className="vp-art-detail" fill="none"/>
      <circle cx="466" cy="66" r="19" className="vp-art-sun"/><path d="M455 84L396 132" className="vp-art-ray"/>
      <rect x="44" y="281" width="25" height="25" className="vp-swatch"/><rect x="76" y="281" width="25" height="25" className="vp-swatch alt"/><rect x="108" y="281" width="25" height="25" className="vp-swatch third"/>
      <text x="149" y="300" className="vp-svg-small">DETAIL · MATERIAL · LIGHT</text>
    </svg>;
  }
  if (stage === 1 && (isDrawings || isInterior)) {
    return <svg className="vp-svg vp-svg-enter" viewBox="0 0 600 350" role="img" aria-label={isInterior ? 'Illustrated approved moodboard with furniture, ceiling, media wall and wardrobe reference cards pinned to the plan' : 'Illustrated developed floor plan with room layout, doors, furniture and dimension lines'}>
      <rect x="158" y="48" width="273" height="247" fill="none"/><path d="M158 160H431M158 218H305M305 160V295M247 48V160M357 160V295M158 263H305" fill="none"/>
      <path d="M170 150Q185 150 185 135M295 160Q295 176 280 176M357 224Q372 224 372 239" className="vp-art-guide" fill="none"/>
      <rect x="178" y="78" width="49" height="39" rx="7" className="vp-art-furniture"/><rect x="272" y="80" width="55" height="36" rx="4" className="vp-art-furniture"/><rect x="177" y="186" width="65" height="20" rx="3" className="vp-art-furniture"/><rect x="368" y="191" width="48" height="32" rx="3" className="vp-art-furniture"/>
      {isInterior ? <><path d="M191 96L88 94M297 96L503 87M208 195L76 261M393 209L509 265" className="vp-art-leader"/><g className="vp-ref-card"><rect x="31" y="62" width="79" height="60"/><path d="M39 105Q70 68 101 104"/><rect x="477" y="54" width="79" height="60"/><path d="M489 67H543M497 78H535M506 96H526"/><rect x="25" y="230" width="81" height="60"/><path d="M36 245H97M36 276H97M51 245V276"/><rect x="473" y="233" width="81" height="58"/><path d="M486 242V282M513 242V282M540 242V282"/></g><text x="33" y="52" className="vp-svg-tiny">FURNITURE</text><text x="482" y="46" className="vp-svg-tiny">CEILING</text><text x="25" y="304" className="vp-svg-tiny">MEDIA WALL</text><text x="474" y="305" className="vp-svg-tiny">WARDROBE</text></> :
        <><path d="M158 34H431M158 28V39M431 28V39M144 48V295M139 48H149M139 295H149" className="vp-art-dim"/><text x="248" y="28" className="vp-svg-small">DIMENSIONED FLOOR PLAN</text><text x="185" y="145" className="vp-svg-tiny">LIVING</text><text x="277" y="144" className="vp-svg-tiny">BEDROOM</text><text x="179" y="254" className="vp-svg-tiny">KITCHEN</text><text x="366" y="280" className="vp-svg-tiny">ENTRY</text></>}
    </svg>;
  }
  if (stage === 1 && !isInterior && !isDrawings) {
    return <svg className="vp-svg vp-svg-enter" viewBox="0 0 600 350" role="img" aria-label="Illustrated rough 3D draft model">
      <path d="M100 238L279 151L471 229L290 313Z M100 238V116L279 36L471 113V229M100 116L290 187L471 113M290 187V313M170 143V237M396 142V257" fill="none"/>
      <path d="M145 247L278 184L423 244" className="vp-art-guide" fill="none"/>
      <text x="52" y="63" className="vp-svg-small">BASIC MASSING / CAMERA VIEW</text>
    </svg>;
  }
  return <svg className="vp-svg vp-svg-enter" viewBox="0 0 600 350" role="img" aria-label={isInterior ? 'Illustrated floor plan with furniture, ceiling, media wall and wardrobe references connected by leader lines' : 'Illustrated rough plot or floor plan with outer dimension arrows and reference thumbnails'}>
    <path d="M154 63H390V281H154Z M154 157H390M257 63V157M283 157V281M154 221H283M334 157V281" fill="none"/>
    <path d="M157 50H389M157 45V55M389 45V55M141 64V280M136 64H146M136 280H146" className="vp-art-dim"/>
    <text x="244" y="44" className="vp-svg-small">PLOT WIDTH</text><text x="105" y="185" transform="rotate(-90 105 185)" className="vp-svg-small">PLOT DEPTH</text>
    <rect x="174" y="81" width="61" height="40" rx="9" className="vp-art-furniture"/><rect x="297" y="87" width="58" height="46" rx="5" className="vp-art-furniture"/>
    <rect x="172" y="177" width="70" height="25" rx="3" className="vp-art-furniture"/><path d="M315 191H374M315 202H374" className="vp-art-guide"/>
    {isInterior ? <><path d="M200 100L75 100M335 105L492 75M212 190L64 256M355 193L511 260" className="vp-art-leader"/><text x="25" y="91" className="vp-svg-tiny">FURNITURE</text><text x="458" y="65" className="vp-svg-tiny">CEILING</text><text x="20" y="273" className="vp-svg-tiny">MEDIA WALL</text><text x="470" y="279" className="vp-svg-tiny">WARDROBE</text><g className="vp-ref-card"><rect x="22" y="108" width="73" height="45"/><path d="M31 140Q58 112 86 138M33 143H85"/><rect x="484" y="88" width="72" height="43"/><path d="M494 100H546M502 108H538M511 119H530"/><rect x="20" y="207" width="77" height="42"/><path d="M29 218H88M29 237H88M41 218V237"/><rect x="488" y="211" width="70" height="43"/><path d="M499 217V249M523 217V249M547 217V249"/></g></> :
      <><path d="M389 141L485 121M389 240L486 253" className="vp-art-leader"/><text x="444" y="92" className="vp-svg-tiny">{isExterior ? 'STYLE REF 01' : 'PLAN'}</text><text x="448" y="223" className="vp-svg-tiny">{isExterior ? 'STYLE REF 02' : 'ROOM BRIEF'}</text><g className="vp-ref-card"><rect x="443" y="102" width="105" height="70"/><path d="M452 154L477 127L497 143L519 116L540 151M452 158H540"/><rect x="446" y="231" width="105" height="68"/><path d="M456 282L478 250L498 270L524 249L541 281M455 287H541"/></g></>}
  </svg>;
}

export default function VisualProcess({ embeddedService, title, stepImages = [], finalImage }: {
  embeddedService: string;
  title: string;
  stepImages?: (string | null)[];
  finalImage?: string | null;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const service = services.find((item) => item.id === embeddedService) || services[0];
  const stage = service.stages[stageIndex];
  const portfolioExample = stageIndex === 3 && !stepImages[3] && !['drawings', 'plans', 'consultation'].includes(service.id);
  const image = stepImages[stageIndex] || (portfolioExample ? finalImage : null);

  return <section className="service-flow" id="service-detail" aria-labelledby="service-detail-title">
    <header className="sf-heading"><span>HOW IT WORKS</span><h2 id="service-detail-title">{title}</h2></header>
    <div className="sf-steps" aria-label="Project stages" style={{ '--progress': stageIndex / 3 } as CSSProperties}>
      {service.stages.map((item, index) => <button type="button" key={item.title} onClick={() => setStageIndex(index)} aria-current={index === stageIndex ? 'step' : undefined} aria-controls="service-stage" className={index === stageIndex ? 'active' : ''}>
        <span className="sf-number">{String(index + 1).padStart(2, '0')}</span><span className="sf-step-name">{item.title}</span>
      </button>)}
    </div>
    <div className="sf-stage" id="service-stage" key={stageIndex}>
      <figure className="sf-picture">
        {image ? <Image src={optimizeCloudinaryUrl(image, 900)} alt={`${title}: ${stage.handoff}${portfolioExample ? ' (portfolio example)' : ''}`} fill sizes="(max-width: 768px) 90vw, 45vw" className="object-contain" unoptimized/> : <div className="sf-placeholder"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true"><rect x="5" y="7" width="30" height="26" rx="3" stroke="currentColor"/><circle cx="15" cy="15" r="3" stroke="currentColor"/><path d="m7 29 9-9 6 6 5-5 6 8" stroke="currentColor"/></svg><span>{stage.handoff}</span><small>Stage image coming soon</small></div>}
        {image && <figcaption>{portfolioExample ? 'Portfolio example' : stage.handoff}</figcaption>}
      </figure>
      <div className="sf-copy"><span className="sf-eyebrow">{stage.owner === 'CLIENT' ? 'YOU PROVIDE' : 'OUR TEAM CREATES'} / {String(stageIndex + 1).padStart(2, '0')}</span><h3>{stage.title}</h3><p>{stage.text}</p><div className="sf-handoff"><span>{stage.owner === 'CLIENT' ? 'To get started' : stageIndex === 3 ? 'Your delivery' : 'For your review'}</span><strong>{stage.handoff}</strong></div></div>
    </div>
    <footer className="sf-footer"><div className="sf-payment" aria-label="Payment milestones"><span><b>30%</b> Advance</span><span><b>40%</b> After {service.id === 'drawings' || service.id === 'plans' ? 'detailed drawings' : service.id === 'consultation' ? 'refined direction' : 'detailed model'}</span><span><b>30%</b> Before delivery</span></div><Link href="/contact">Start a project ↗</Link></footer>
  </section>;
}
