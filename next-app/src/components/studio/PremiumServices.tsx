import Link from "next/link";
import { ServiceIcon } from "./HomeSections";
import Image from "@/components/studio/RenderImage";
import { SERVICES, workMatches, type PublicWork } from "@/lib/services";
import type { Pricing } from "@/lib/pricing";
import { servicePrice } from "@/lib/service-price";
import { optimizeCloudinaryUrl } from "@/lib/media";
export default function PremiumServices({
  items,
  pricing,
  compact = false,
}: {
  items: PublicWork[];
  pricing: Pricing;
  compact?: boolean;
}) {
  const services = SERVICES.filter(
    (s) =>
      !compact ||
      [
        "house-plans",
        "front-elevation",
        "interior-design",
        "drawing-booklets",
      ].includes(s.slug),
  );
  return (
    <div
      className={
        compact ? "premium-service-index" : "premium-service-directory"
      }
    >
      {services.map((s, index) => {
        const item = items.find((i) => workMatches(i, s.category));
        return (
          <article key={s.slug}>
            {
              <Link
                className="premium-service-photo"
                href={"/services/" + s.slug}
                aria-label={"Explore " + s.title}
              >
                {item ? (
                  <Image
                    src={optimizeCloudinaryUrl(item.image_url, 850)}
                    alt={`RenderLine ${s.title} example`}
                    fill
                    sizes="(max-width:700px) 90vw, 42vw"
                  />
                ) : (
                  <div className="premium-drawing-sheet">
                    <span>Architectural booklet</span>
                    <p>
                      Plans
                      <br />
                      Elevations
                      <br />
                      Sections & details
                    </p>
                    <small>Project-specific drawing index</small>
                  </div>
                )}
              </Link>
            }
            <div className="premium-service-information">
              <div>
                {!compact && <span className="edition-service-number">{String(index+1).padStart(2,"0")}</span>}
                <h3>
                  <ServiceIcon slug={s.slug} size={23} />
                  <Link href={"/services/" + s.slug}>{s.title}</Link>
                </h3>
                <p>{compact ? s.short : s.description}</p>
                <span>{servicePrice(s.slug, pricing)}</span>
                {!compact && <ul className="edition-service-includes">{s.includes.slice(0,2).map(text=><li key={text}>{text}</li>)}</ul>}
              </div>
              <Link
                href={"/services/" + s.slug}
                className="premium-service-arrow"
                aria-label={"View " + s.title}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
