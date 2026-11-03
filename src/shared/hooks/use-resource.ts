"use client";

import { useCallback, useEffect, useState } from "react";

export interface ResourceState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refresh(): void;
}

export function useResource<T>(url: string): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const body: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            typeof body === "object" && body !== null && "error" in body
              ? String(body.error)
              : `Request failed (${response.status})`;
          throw new Error(message);
        }
        return body as T;
      })
      .then((value) => {
        setData(value);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [url, revision]);

  useEffect(() => {
    window.addEventListener("telemetry:refresh", refresh);
    return () => window.removeEventListener("telemetry:refresh", refresh);
  }, [refresh]);

  return { data, error, loading, refresh };
}
