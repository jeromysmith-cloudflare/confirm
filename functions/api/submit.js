export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();

    // OPTIONAL: basic validation
    if (!payload?.caseId || !payload?.resourceId) {
      return new Response(JSON.stringify({ message: "Missing caseId or resourceId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Forward to your webhook
    const resp = await fetch(env.SUBMIT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await resp.text(); // webhook might not return JSON

    return new Response(
      JSON.stringify({
        ok: resp.ok,
        status: resp.status,
        upstream: text
      }),
      {
        status: resp.ok ? 200 : 502,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: err?.message || "Submit failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
