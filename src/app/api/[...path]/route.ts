import { proxyApiRequest } from "@/shared/api/proxy";
import { resolveBackendUrl } from "@/shared/config/backend-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  return proxyApiRequest(request, path, resolveBackendUrl());
}
