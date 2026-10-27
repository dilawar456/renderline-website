import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { getSiteContent } from "@/lib/public-data";
import {
  publicContactEmail,
  publicPhoneDisplay,
  publicWhatsAppNumber,
} from "@/lib/public-contact";
import EnquiryLink from "@/components/studio/EnquiryLink";
import ContactForm from "./ContactForm";
export const metadata: Metadata = {
  title: "Contact RenderLine Studio",
  description:
    "Discuss your house plans, drawing package or architectural visualization project with RenderLine Studio in Lahore, Pakistan.",
  alternates: { canonical: "/contact" },
};
export const revalidate = 60;
export default async function ContactPage() {
  const { data: c } = await getSiteContent(),
    number = publicWhatsAppNumber(c?.contact_whatsapp),
    email = publicContactEmail(c?.contact_email);
  return (
    <div className="rl-site edition-page edition-contact rl-shell">
      <div className="edition-contact-layout">
        <section className="edition-contact-story">
          <Link href="/" className="edition-back">RenderLine Studio / Contact</Link>
          <h1>Every great space<br />starts with a conversation.</h1>
          <p>Share your plot, drawings or design idea. We’ll help you choose the right service and agree a clear scope.</p>
          <div className="edition-contact-methods">
            <EnquiryLink number={number} message="Hello RenderLine Studio, I would like to discuss my project." className="edition-contact-method"><MessageCircle size={24} aria-hidden="true" /><span><small>Talk on WhatsApp</small><strong>{publicPhoneDisplay(c?.contact_phone_display, number)}</strong></span></EnquiryLink>
            <a href={"mailto:" + email} className="edition-contact-method"><Mail size={24} aria-hidden="true" /><span><small>Send an email</small><strong>{email}</strong></span></a>
          </div>
          <div className="edition-contact-note"><h2>Already working with us?</h2><p>Your invited portal keeps project conversations and deliverables together.</p><Link href="/portal" className="rl-text-link">Open your workspace ↗</Link></div>
          <p className="edition-location">Lahore, Pakistan · Remote collaboration</p>
        </section>
        <ContactForm whatsappNumber={number} />
      </div>
    </div>
  );
}
