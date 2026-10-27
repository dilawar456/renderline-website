import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { getSiteContent } from "@/lib/public-data";
import { publicWhatsAppNumber } from "@/lib/public-contact";
import EnquiryLink from "./studio/EnquiryLink";
export default async function Footer() {
  // A public-content outage must not prevent the entire layout from rendering.
  const { data: content } = await getSiteContent().catch(() => ({ data: null }));
  return (
    <footer className="rl-site studio-footer">
      <div className="studio-footer-inner">
        <Link href="/" className="studio-footer-brand" aria-label="RenderLine Studio home">
          <Image src="/assets/logo.png" alt="" width={32} height={38} />
          <span>RenderLine <small>Studio</small></span>
        </Link>
        <EnquiryLink className="studio-footer-contact" number={publicWhatsAppNumber(content?.contact_whatsapp)} message="Hello RenderLine Studio, I would like to discuss a project.">
          <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" /> WhatsApp
        </EnquiryLink>
      </div>
    </footer>
  );
}
