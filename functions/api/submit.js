export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();

    // Basic validation
    if (!payload?.caseId || !payload?.resourceId) {
      return new Response(JSON.stringify({ message: "Missing caseId or resourceId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Normalize (support both old + new client payloads)
    const normalized = {
      caseId: payload.caseId,
      variant: payload.variant ?? "TPS",
      resourceId: payload.resourceId,

      // Old names preferred, fallback to new names
      scheduledDate: payload.scheduledDate ?? payload.date ?? "",
      scheduledTime: payload.scheduledTime ?? payload.time ?? "",

      notes: payload.notes ?? "",
      sig: payload.sig ?? "",

      // Always set server-side
      submittedAt: new Date().toISOString()
    };

    // Optional: validate date/time presence
    if (!normalized.scheduledDate || !normalized.scheduledTime) {
      return new Response(JSON.stringify({ message: "Missing scheduledDate/scheduledTime" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Forward to your webhook
    const resp = await fetch(env.SUBMIT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized)
    });

    const text = await resp.text();

    return new Response(
      JSON.stringify({
        ok: resp.ok,
        status: resp.status,
        forwarded: normalized,   // helpful while testing; remove later if you want
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
