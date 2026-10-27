import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { getSiteContent } from "@/lib/supabase";
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
    <div className="rl-site">
      <section className="rl-page-intro rl-shell">
        <h1>Tell us what you’re planning.</h1>
        <p>
          Send a drawing, describe your plot or share a design reference. We’ll
          help define the right scope before quoting.
        </p>
      </section>
      <section
        className="rl-section rl-shell rl-deliverables"
        style={{ paddingTop: 10 }}
      >
        <div>
          <h2>Talk to the studio.</h2>
          <p>Lahore, Pakistan · remote project collaboration</p>
          <p>
            <EnquiryLink
              className="rl-text-link"
              number={number}
              message="Hello RenderLine Studio, I would like to discuss my project."
            >
              <MessageCircle size={19} strokeWidth={1.5} aria-hidden="true" />
              {publicPhoneDisplay(c?.contact_phone_display, number)}
            </EnquiryLink>
          </p>
          <p>
            <a className="rl-text-link" href={"mailto:" + email}>
              <Mail size={19} strokeWidth={1.5} aria-hidden="true" />
              {email}
            </a>
          </p>
          <p>
            Have drawings? Attach them inside the WhatsApp conversation.
            Existing invited clients can share files in their portal workspace.
          </p>
          <div className="rl-actions">
            <Link className="rl-button rl-button-quiet" href="/start-project">
              Use the project guide
            </Link>
            <Link className="rl-text-link" href="/portal">
              Open client portal
            </Link>
          </div>
        </div>
        <ContactForm whatsappNumber={number} />
      </section>
    </div>
  );
}
