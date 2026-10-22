export async function GET() {
  return Response.json(
    { app: 'renderline-website', status: 'ok' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
