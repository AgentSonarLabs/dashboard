# Agent Observability Dashboard

Self-hosted web dashboard for agent runs, spans, logs, errors, and deterministic findings. The browser uses same-origin routes; server-side adapters communicate with the backend.

## Status

Active development. The workspace-level [`specs/`](../specs/) tracks the intended contract; use only routes implemented in this repository.

## Run locally

Requires Node.js 22 or newer and npm.

```sh
npm install
npm run dev
```

Set `AGENT_OBSERVABILITY_COLLECTOR_URL` when the backend is not at `http://127.0.0.1:4318`.

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
