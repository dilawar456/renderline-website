export const SERVICES = [
  {
    slug: "house-plans",
    title: "House plans & floor plans",
    short: "Make room for the way you live.",
    description:
      "Start with your plot, your family and the spaces you need. Review a room layout before moving into detailed drawings.",
    category: "floorplan",
    price: "floor-plan",
    includes: [
      "Dimensioned floor plans for up to two storeys",
      "Room arrangement, circulation and staircase planning",
      "Furniture layout and other architectural working details excluded",
    ],
    needs:
      "Plot length and width, road-facing side, location, floors and room requirements.",
    faq: "Can I order only a floor plan?",
    answer:
      "Yes. You can commission planning on its own, or include it in an agreed architectural booklet scope.",
  },
  {
    slug: "front-elevation",
    title: "3D front elevation",
    short: "See your house before it is built.",
    description:
      "A 2D elevation shows heights and outlines. A 3D front elevation shows the proposed façade with materials, lighting and depth, so you can review its appearance.",
    category: "elevation",
    price: "elevation",
    includes: [
      "Front façade design and 3D presentation within the agreed scope",
      "Material and finish direction",
      "Optional elevation working drawings, priced separately or as a combined package",
    ],
    needs:
      "Approved floor plans, plot dimensions, building heights, photographs if built, and design references.",
    faq: "Can you prepare working drawings from an existing elevation?",
    answer:
      "Yes. Elevation working alone is available, as is a combined visualization and working package.",
  },
  {
    slug: "interior-design",
    title: "Interior design & visualization",
    short: "See how a space comes together.",
    description:
      "Review the furniture, finishes and lighting of a room or commercial space before making design decisions.",
    category: "interior",
    price: "interior",
    includes: [
      "Interior design and visualization for the selected space",
      "Furniture, material and lighting direction within scope",
      "Interior working drawings available as a separate service",
    ],
    needs:
      "Room dimensions or CAD/PDF plans, room use, photographs, references and required views.",
    faq: "How is interior pricing calculated?",
    answer:
      "Residential interior guide pricing uses the actual area of each space, subject to a minimum per space. Commercial marla-based visualization and working rates are listed separately.",
  },
  {
    slug: "drawing-booklets",
    title: "Architectural drawing booklets",
    short: "A clear set of drawings for the next step.",
    description:
      "Bring your agreed house plan, elevations and architectural details into one coordinated booklet. The residential package includes a 3D front elevation.",
    category: "working",
    price: "booklet",
    includes: [
      "Architectural plans, elevations, sections and details as agreed in the drawing index",
      "3D front elevation included",
      "Electrical, plumbing and specialist drawing requirements reviewed before quotation",
    ],
    needs:
      "Plot dimensions, location/society, required floors, approved layout if available, and your drawing requirements.",
    faq: "Are structure and submission included?",
    answer:
      "No. Structural design/drawings and authority submission drawings have separate rates. Authority fees, signatures/stamping and approval are not included or guaranteed.",
  },
  {
    slug: "exterior-visualization",
    title: "Exterior visualization",
    short: "Communicate the complete building.",
    description:
      "Present buildings, façades and their surroundings with project-specific materials, lighting and camera views.",
    category: "exterior",
    price: "exterior",
    includes: [
      "Exterior 3D visuals for the agreed building and views",
      "Materials, lighting and site context as quoted",
      "Commercial exterior options and bespoke complex-project quotes",
    ],
    needs:
      "Drawings or model, elevations, landscape scope, reference images and required views.",
    faq: "What if my project is not measured in marla?",
    answer:
      "Share the building, site and required views. We quote the actual modeling and visualization complexity rather than forcing it into a residential plot-size package.",
  },
  {
    slug: "3d-modeling",
    title: "Architectural 3D modeling",
    short: "Turn drawings into a useful model.",
    description:
      "Develop a 3D architectural model from your drawings or agreed design information for visualization and review.",
    category: "exterior",
    price: "Custom modeling quote",
    includes: [
      "Modeling scope agreed from your source drawings",
      "Geometry and detail level suited to the intended output",
      "Source model delivery only when included in the quote",
    ],
    needs:
      "CAD/PDF drawings, dimensions, reference files, required level of detail and intended software/file format.",
    faq: "Does a render price include the source model?",
    answer:
      "Source models, editable CAD files and specialist export formats are included only when explicitly agreed in the quotation.",
  },
  {
    slug: "walkthrough-animation",
    title: "Walkthrough animation",
    short: "Take a cinematic journey through the design.",
    description:
      "A pre-rendered architectural video presents spaces, materials and movement in a sequence you can share with your clients.",
    category: "animation",
    price: "Custom animation quote",
    includes: [
      "Agreed camera route and video duration",
      "Architectural modeling and scene work as quoted",
      "A rendered video in the agreed delivery format",
    ],
    needs:
      "Plans or model, camera route, required duration, resolution and presentation deadline.",
    faq: "Is this an interactive virtual tour?",
    answer:
      "This service is a pre-rendered video. Interactive VR, AR and real-time navigation are not offered.",
  },
] as const;
export const PORTFOLIO_CATEGORIES = [
  { key: "all", label: "All work" },
  { key: "floorplan", label: "Floor plans" },
  { key: "elevation", label: "Front elevations" },
  { key: "interior", label: "Interiors" },
  { key: "exterior", label: "Exteriors" },
  { key: "working", label: "Working drawings" },
  { key: "commercial", label: "Commercial" },
  { key: "animation", label: "Animations" },
];
export type PublicWork = {
  id: string | number;
  title: string;
  image_url: string;
  category?: string;
};
export function workMatches(item: PublicWork, category: string): boolean {
  const tags = (item.category || "").split("|");
  return (
    category === "all" ||
    tags.includes(category) ||
    (category === "elevation" && /elevation/i.test(item.title))
  );
}
export function serviceHref(category: string) {
  return (
    "/services/" +
    (SERVICES.find((s) => s.category === category)?.slug ||
      "exterior-visualization")
  );
}
