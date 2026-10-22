/** Resolve the studio link without publishing a visitor's localhost as a live portal. */
export function portalDestination(host: string | null, configured: string | undefined, mode: string | undefined) {
  const localHost = (() => {
    try { return ['localhost', '127.0.0.1', '[::1]'].includes(new URL(`http://${host}`).hostname); }
    catch { return false; }
  })();
  if (configured?.trim()) {
    try {
      const url = new URL(configured.trim());
      const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
      if (url.username || url.password || url.search || url.hash) return null;
      if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback && localHost && mode !== 'production')) return null;
      if (loopback && (!localHost || mode === 'production')) return null;
      if (url.host === host && /^\/portal(?:\/|$)/.test(url.pathname)) return null;
      return { url: url.toString(), local: loopback };
    } catch { return null; }
  }
  return localHost && mode !== 'production' ? { url: 'http://127.0.0.1:4173/', local: true } : null;
}
