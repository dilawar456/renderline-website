import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function PageHeading({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return <header className="edition-heading"><div><Link href="/" className="edition-back">RenderLine Studio /</Link><h1>{title}</h1></div><div className="edition-heading-aside"><p>{description}</p>{children}</div></header>;
}
export function PageAction({title, text, href, action}: {title:string;text:string;href:string;action:string}) {
  return <section className="edition-action"><div><h2>{title}</h2><p>{text}</p></div><Link className="rl-button" href={href}>{action}<ArrowUpRight size={18} aria-hidden="true" /></Link></section>;
}
