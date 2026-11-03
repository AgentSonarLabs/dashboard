export const DEFAULT_BACKEND_URL = "http://127.0.0.1:4318";

export function resolveBackendUrl(
  environment: Record<string, string | undefined> = process.env,
): string {
  const configured = environment.AGENT_OBSERVABILITY_BACKEND_URL?.trim();
  return (configured || DEFAULT_BACKEND_URL).replace(/\/+$/, "");
}

