# Feature modules

Each feature owns its UI and feature-specific API/state. A feature may depend on `src/entities` and `src/shared`; it must not import another feature's private implementation.

- `overview`: fleet and recent activity overview.
- `runs`: run list.
- `run-detail`: one run and its span timeline.
- `logs`: searchable agent logs.
- `errors`: error and finding review.
- `settings`: local instance settings and connection details.

