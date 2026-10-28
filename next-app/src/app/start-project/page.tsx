import { publicMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, MessageCircle, ShieldCheck } from "lucide-react";
import ProjectStarter from "@/components/studio/ProjectStarter";
import { getPricing } from "@/lib/public-data";
import { getSiteContent } from "@/lib/public-data";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import { SERVICES } from "@/lib/services";
export const metadata: Metadata = publicMetadata({
  title: "Start Your Design Project",
  description:
    "Build a short project brief for house plans, working drawings, 3D elevations, interiors or architectural visualization.",
  alternates: { canonical: "/start-project" },
});
export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [query, p, { data }] = await Promise.all([
    searchParams,
    getPricing(),
    getSiteContent(),
  ]);
  const initial = SERVICES.some((s) => s.slug === query.service)
    ? query.service
    : "house-plans";
  return (
    <div className="rl-site edition-start rl-shell edition-page">
      <div className="edition-brief-layout"><aside className="edition-brief-intro"><Link href="/" className="edition-back">RenderLine Studio / Project guide</Link><h1>A clear brief.<br /><em>A better start.</em></h1><p>Choose your service, share the essentials and review your project brief before opening WhatsApp.</p><ol><li><FileText size={21} aria-hidden="true" /><span><strong>Choose your service</strong>Start with only the work you need.</span></li><li><MessageCircle size={21} aria-hidden="true" /><span><strong>Tell us about it</strong>Dimensions, references and your priorities.</span></li><li><ShieldCheck size={21} aria-hidden="true" /><span><strong>Review before sharing</strong>Your details stay here until you open WhatsApp.</span></li></ol><Link href="/pricing" className="rl-text-link">Compare guide prices ↗</Link></aside>
      <div className="edition-brief-form"><ProjectStarter pricing={p} number={publicWhatsAppNumber(data?.contact_whatsapp)} initial={initial} /></div></div>
    </div>
  );
}
