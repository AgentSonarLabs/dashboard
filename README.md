# AI Agent Observability Dashboard

Standalone Next.js dashboard repository for viewing agent telemetry collected by the self-hosted backend.

## Status

This is the dashboard package scaffold. It does not yet implement the product screens. The workspace-level `specs/` documents define the intended behavior; the dashboard will consume the backend's versioned HTTP contract once that contract is established.

## Source layout

- `src/app`: Next.js routes and application shell.
- `src/features`: screen-oriented product modules.
- `src/entities/telemetry`: dashboard telemetry model and vocabulary.
- `src/shared`: cross-feature API, config, formatting, UI, and hook utilities.

The npm package name and environment variable names are working names and can be changed before the first public release.

`app` is the routing/composition layer. A route delegates to one feature; features may depend on `entities` and `shared`. `entities` and `shared` stay feature-independent, and `shared` stays independent of product entities.
