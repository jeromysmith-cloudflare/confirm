export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  const allowedVariants = ["TPS", "SME"];
  const requestedVariant = (url.searchParams.get("v") || "TPS").toUpperCase();

  const variant = allowedVariants.includes(requestedVariant)
    ? requestedVariant
    : "TPS";

  const resourceKey = `resources_${variant}`;
  const data = await env.RESOURCES_KV.get(resourceKey);

  return new Response(data ?? "[]", {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
