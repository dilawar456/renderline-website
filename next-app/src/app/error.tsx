"use client";
import Link from "next/link";
export default function PageError({retry}:{retry:()=>void}) {
 return <div className="rl-site"><section className="rl-shell edition-recovery" role="alert"><p>We couldn’t load this page</p><h1>A brief interruption.</h1><p>Please try again. Your saved project information has not been changed.</p><div className="rl-actions"><button type="button" className="rl-button" onClick={retry}>Try loading again</button><Link className="rl-text-link" href="/">Back to home</Link></div></section></div>;
}
