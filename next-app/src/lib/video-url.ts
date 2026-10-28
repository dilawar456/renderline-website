export function videoSource(value: unknown): { url: string; youtubeId: string | null } | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.slice(1);
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host))
      id = url.pathname === "/watch" ? url.searchParams.get("v") : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1] || null;
    return { url: url.href, youtubeId: id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null };
  } catch { return null; }
}
