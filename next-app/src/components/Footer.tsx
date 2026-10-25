import Link from "next/link";
import { getSiteContent } from "@/lib/supabase";
import {
  publicContactEmail,
  publicWhatsAppNumber,
  publicPhoneDisplay,
} from "@/lib/public-contact";
import EnquiryLink from "./studio/EnquiryLink";
export default async function Footer() {
  const { data: c } = await getSiteContent(),
    number = publicWhatsAppNumber(c?.contact_whatsapp),
    email = publicContactEmail(c?.contact_email);
  return (
    <footer
      className="rl-site"
      style={{ minHeight: 0, borderTop: "1px solid #dce1e5" }}
    >
      <div className="rl-shell" style={{ paddingBlock: 40 }}>
        <div className="rl-section-head">
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: 24,
                color: "#17232d",
              }}
            >
              RenderLine Studio
            </Link>
            <p>House plans. Drawing booklets. Design in 3D.</p>
          </div>
          <div className="rl-actions">
            <EnquiryLink
              className="rl-text-link"
              number={number}
              message="Hello RenderLine Studio, I would like to discuss a project."
            >
              {publicPhoneDisplay(c?.contact_phone_display, number)}
            </EnquiryLink>
            <a className="rl-text-link" href={"mailto:" + email}>
              {email}
            </a>
          </div>
        </div>
        <nav
          aria-label="Footer navigation"
          className="rl-actions"
          style={{ fontSize: 14, gap: "15px 25px" }}
        >
          {[
            ["/services", "Services"],
            ["/portfolio", "Portfolio"],
            ["/pricing", "Pricing"],
            ["/drawing-samples", "Drawing samples"],
            ["/about", "About"],
            ["/contact", "Contact"],
            ["/portal", "Client portal"],
          ].map(([url, title]) => (
            <Link href={url} key={url}>
              {title}
            </Link>
          ))}
          <a
            href="https://instagram.com/renderline.arch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </nav>
        <p className="rl-note" style={{ marginTop: 28, marginBottom: 0 }}>
          © {new Date().getFullYear()} RenderLine Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
