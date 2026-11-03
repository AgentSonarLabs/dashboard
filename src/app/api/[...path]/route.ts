import { resolveBackendUrl } from "@/shared/config/backend-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  if (path[0] !== "api") {
    return Response.json({ error: "route not found" }, { status: 404 });
  }

  const backend = resolveBackendUrl();
  const upstreamUrl = new URL(path.map(encodeURIComponent).join("/"), `${backend}/`);
  upstreamUrl.search = new URL(request.url).search;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { accept: request.headers.get("accept") ?? "application/json" },
      cache: "no-store",
    });
    const headers = new Headers();
    for (const name of ["content-type", "cache-control", "x-accel-buffering"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    headers.set("cache-control", "no-store");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  } catch {
    return Response.json({ error: "backend is unavailable" }, { status: 502 });
  }
}
