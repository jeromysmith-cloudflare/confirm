export async function onRequest({ env }) {
  const data = await env.RESOURCES_KV.get("resources");

  return new Response(data ?? "[]", {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store" // keep this while testing
    }
  });
}
