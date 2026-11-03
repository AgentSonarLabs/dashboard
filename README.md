# Agent Observability Dashboard

Self-hosted web dashboard for agent runs, spans, logs, errors, and deterministic findings. The browser uses same-origin routes; server-side adapters communicate with the backend.

## Run locally

Requires Node.js 22 or newer and npm.

```sh
npm install
npm run dev
```

Set `AGENT_OBSERVABILITY_BACKEND_URL` when the backend is not at `http://127.0.0.1:4318`. Browser requests use the same-origin `/api/*` proxy, including the live `/api/stream` event connection.

The dashboard includes Overview, Runs, Run detail, Errors, Logs, and Settings screens. It shows empty, loading, and backend error states and refreshes telemetry views when the backend publishes SSE events.

## Container

The production image uses Next.js standalone output. From this repository:

```sh
docker build -t agent-observability-dashboard .
docker run --rm -p 3000:3000 -e AGENT_OBSERVABILITY_BACKEND_URL=http://host.docker.internal:4318 agent-observability-dashboard
```

## Architecture

- `src/app/`: Next.js route composition and shell.
- `src/features/`: user-facing workflows.
- `src/entities/`: telemetry domain types and models.
- `src/shared/`: API, config, formatting, and reusable UI.

## Development

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

See [CHANGELOG.md](CHANGELOG.md), [SECURITY.md](SECURITY.md), and [CONTRIBUTING.md](CONTRIBUTING.md). License: [MIT](LICENSE).
