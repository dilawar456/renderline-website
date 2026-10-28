import type { Metadata } from "next";
import { SITE_URL } from "./site-url";

/** Share cards and canonical URLs use the same public origin on every public page. */
export function publicMetadata(metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : "RenderLine Studio";
  const canonical = metadata.alternates?.canonical;
  const url = new URL(typeof canonical === "string" ? canonical : "/", SITE_URL).href;
  return {
    ...metadata,
    openGraph: { type: "website", siteName: "RenderLine Studio", locale: "en_PK", title, description: metadata.description || undefined, url },
    twitter: { card: "summary_large_image", title, description: metadata.description || undefined, images: [SITE_URL + "/opengraph-image"] },
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
