import Link from "next/link";
export default function NotFound() {
 return <div className="rl-site"><section className="rl-shell edition-recovery"><p>404 / Page not found</p><h1>Let’s find the<br />right space.</h1><p>This address doesn’t lead to a page. Explore the studio’s work or choose a service to get started.</p><div className="rl-actions"><Link className="rl-button" href="/portfolio">Explore the portfolio ↗</Link><Link className="rl-text-link" href="/">Back to home</Link></div></section></div>;
}
