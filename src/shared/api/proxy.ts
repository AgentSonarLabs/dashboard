export async function proxyApiRequest(
  request: Request,
  path: string[],
  backendUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const upstreamUrl = new URL(["api", ...path].map(encodeURIComponent).join("/"), `${backendUrl}/`);
  upstreamUrl.search = new URL(request.url).search;

  try {
    const upstream = await fetcher(upstreamUrl, {
      headers: { accept: request.headers.get("accept") ?? "application/json" },
      cache: "no-store",
      signal: request.signal,
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
    if (request.signal.aborted) return new Response(null, { status: 499 });
    return Response.json({ error: "backend is unavailable" }, { status: 502 });
  }
}
