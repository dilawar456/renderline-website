import Image from "next/image";
import Link from "next/link";
import { Files, MessagesSquare, ListChecks } from "lucide-react";
export default function PortalWelcome() {
  return <section className="studio-login-story edition-portal-welcome">
    <Link href="/" className="edition-portal-brand"><Image src="/assets/logo.png" alt="" width={44} height={54}/><span>RenderLine<small>Client & studio workspace</small></span></Link>
    <div><h1>Your project.<br />All in one place.</h1><p>From the first shared drawing to the final approved file. A private workspace for your project and the people making it happen.</p></div>
    <div className="edition-portal-features"><span><ListChecks size={20} aria-hidden="true"/>Follow progress</span><span><MessagesSquare size={20} aria-hidden="true"/>Share feedback</span><span><Files size={20} aria-hidden="true"/>Review deliverables</span></div>
    <Link href="/" className="studio-back-link">← Back to the website</Link>
  </section>;
}
