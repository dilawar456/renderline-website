import { money, type Pricing } from "./pricing";
export function servicePrice(slug: string, p: Pricing) {
  if (slug === "house-plans")
    return `From ${money(p.floorPlan.upTo10)} / up to 2 storeys`;
  if (slug === "drawing-booklets")
    return `From ${money(p.residentialBooklet["3"])} / architectural booklet`;
  if (slug === "front-elevation")
    return `${money(p.elevation.visualization)} / 3D front elevation`;
  if (slug === "interior-design")
    return `${money(p.interior.perSqFt)} / sq ft · minimum ${money(p.interior.minimumPerSpace)} / space`;
  if (slug === "exterior-visualization")
    return "Project-specific quote · commercial rates available";
  return "Quoted to your project scope";
}
