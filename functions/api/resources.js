export async function onRequest({ env, request }) {
  return new Response(
    JSON.stringify({
      debug: "HIT-PAGES-FUNCTION",
      time: new Date().toISOString(),
      url: request.url
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Debug": "HIT-PAGES-FUNCTION"
      }
    }
  );
}
