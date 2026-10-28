import Image from "./RenderImage";
import { optimizeCloudinaryUrl } from "@/lib/media";
import { workMatches, type PublicWork } from "@/lib/services";

export default function PortfolioArtwork({ items, preferred, category, caption, className = "", priority = false }: {
  items: PublicWork[]; preferred?: number; category: string; caption: string; className?: string; priority?: boolean;
}) {
  const item = items.find(i => Number(i.id) === preferred) || items.find(i => workMatches(i, category));
  if (!item) return null;
  return <figure className={"atelier-artwork " + className}>
    <div><Image src={optimizeCloudinaryUrl(item.image_url, 1400)} alt="Architectural visualization from the RenderLine Studio portfolio" fill sizes="(max-width:700px) 90vw, 50vw" priority={priority} /></div>
    <figcaption><span>RenderLine Studio</span><span>{caption}</span></figcaption>
  </figure>;
}
