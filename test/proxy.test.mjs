import assert from "node:assert/strict";
import test from "node:test";
import { proxyApiRequest } from "../.test-build/shared/api/proxy.js";

test("API proxy adds the /api route prefix and preserves query parameters", async () => {
  let requestedUrl = "";
  let requestedAccept = "";
  const response = await proxyApiRequest(
    new Request("http://dashboard.local/api/runs?limit=10"),
    ["runs"],
    "http://backend.internal:4318",
    async (input, init) => {
      requestedUrl = String(input);
      requestedAccept = new Headers(init?.headers).get("accept") ?? "";
      return Response.json({ runs: [] });
    },
  );

  assert.equal(requestedUrl, "http://backend.internal:4318/api/runs?limit=10");
  assert.equal(requestedAccept, "application/json");
  assert.deepEqual(await response.json(), { runs: [] });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("API proxy streams SSE responses without buffering", async () => {
  const response = await proxyApiRequest(
    new Request("http://dashboard.local/api/stream", {
      headers: { accept: "text/event-stream" },
    }),
    ["stream"],
    "http://backend.internal:4318",
    async (_input, init) => {
      assert.equal(new Headers(init?.headers).get("accept"), "text/event-stream");
      return new Response("event: ready\n\n", {
        headers: {
          "content-type": "text/event-stream",
          "x-accel-buffering": "no",
        },
      });
    },
  );

  assert.equal(response.headers.get("content-type"), "text/event-stream");
  assert.equal(response.headers.get("x-accel-buffering"), "no");
  assert.equal(await response.text(), "event: ready\n\n");
});

test("API proxy reports backend connection failures", async () => {
  const response = await proxyApiRequest(
    new Request("http://dashboard.local/api/overview"),
    ["overview"],
    "http://backend.internal:4318",
    async () => {
      throw new Error("connection refused");
    },
  );

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "backend is unavailable" });
});

test("API proxy cancels upstream SSE when the dashboard request is aborted", async () => {
  const controller = new AbortController();
  controller.abort();
  let upstreamSignal;
  const response = await proxyApiRequest(
    new Request("http://dashboard.local/api/stream", { signal: controller.signal }),
    ["stream"],
    "http://backend.internal:4318",
    async (_input, init) => {
      upstreamSignal = init?.signal;
      throw new DOMException("The request was aborted", "AbortError");
    },
  );

  assert.equal(upstreamSignal?.aborted, true);
  assert.equal(response.status, 499);
});
