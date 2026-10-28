export class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

/** Enforce the actual streamed size, including requests without Content-Length. */
export async function readJsonObject(request: Request, limit = 200000): Promise<Record<string, unknown>> {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || ""))
    throw new HttpError(415, "Send an application/json request.");
  if (Number(request.headers.get("content-length")) > limit)
    throw new HttpError(413, "Request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "A JSON object is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new HttpError(413, "Request is too large.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let body: unknown;
  try { body = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new HttpError(400, "Request contains invalid JSON."); }
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new HttpError(400, "A JSON object is required.");
  return body as Record<string, unknown>;
}

export function safeApiError(error: unknown): Response {
  const prefixed = error instanceof Error ? error.message.match(/^(400|401|403|413|415|503):(.+)$/) : null;
  const status = error instanceof HttpError ? error.status : prefixed ? Number(prefixed[1]) : 500;
  const message = error instanceof HttpError ? error.message : prefixed ? prefixed[2] : "The request could not be completed. Please retry.";
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
