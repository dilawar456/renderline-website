export default function PageLoading({ layout = "gallery" }: { layout?: "gallery" | "guide" | "services" }) {
  return <div className="rl-site"><section className={"rl-shell atelier-loading atelier-loading-" + layout} role="status" aria-label="Loading page">
    <span className="sr-only">Loading your page.</span>
    <div className="atelier-loading-intro" aria-hidden="true"><span /><span /><span /></div>
    <div className="atelier-loading-frames" aria-hidden="true"><div /><div /><div /></div>
  </section></div>;
}
