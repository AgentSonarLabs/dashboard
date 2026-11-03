import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, createApiClient } from "../.test-build/shared/api/client.js";

test("API client joins normalized base paths and decodes JSON", async () => {
  let requestedUrl = "";
  let requestedMethod = "";
  const client = createApiClient({
    baseUrl: "http://backend.internal:4318///",
    fetch: async (input, init) => {
      requestedUrl = String(input);
      requestedMethod = init?.method ?? "";
      return Response.json({ runs: [] });
    },
  });

  assert.deepEqual(await client.get("/api/runs"), { runs: [] });
  assert.equal(requestedUrl, "http://backend.internal:4318/api/runs");
  assert.equal(requestedMethod, "GET");
});

test("API client includes backend error status and message", async () => {
  const client = createApiClient({
    baseUrl: "http://backend.internal:4318",
    fetch: async () => new Response("database unavailable", { status: 503 }),
  });

  await assert.rejects(
    () => client.get("/api/overview"),
    (error) =>
      error instanceof ApiError &&
      error.status === 503 &&
      error.message === "database unavailable" &&
      error.url === "http://backend.internal:4318/api/overview",
  );
});
