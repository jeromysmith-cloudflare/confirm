export async function onRequest() {
  return new Response("FUNCTION HIT OK", {
    headers: { "Cache-Control": "no-store" }
  });
}
