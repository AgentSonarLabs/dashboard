export interface ApiClientOptions {
  baseUrl: string;
  fetch?: typeof fetch;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiClient {
  get<T>(path: string, init?: Omit<RequestInit, "method">): Promise<T>;
}

export function createApiClient({ baseUrl, fetch: fetcher = fetch }: ApiClientOptions): ApiClient {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

  return {
    async get<T>(path, init = {}) {
      const url = `${normalizedBaseUrl}/${path.replace(/^\/+/, "")}`;
      const response = await fetcher(url, { ...init, method: "GET" });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new ApiError(body || `Backend request failed with status ${response.status}`, response.status, url);
      }

      return (await response.json()) as T;
    },
  };
}

