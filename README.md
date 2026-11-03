# AI Agent Observability Dashboard

Standalone Next.js dashboard repository for viewing agent telemetry collected by the self-hosted backend.

## Status

This is the dashboard package scaffold. It does not yet implement the product screens. The workspace-level `specs/` documents define the intended behavior; the dashboard will consume the backend's versioned HTTP contract once that contract is established.

## Source layout

- `src/app`: Next.js routes and application shell.
- `src/components`: reusable dashboard UI.
- `src/features`: screen-oriented product modules.
- `src/hooks`: reusable React hooks.
- `src/entities/telemetry`: dashboard telemetry model and vocabulary.
- `src/shared`: cross-feature API, config, formatting, UI, and hook utilities.

The npm package name and environment variable names are working names and can be changed before the first public release.
