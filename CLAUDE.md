# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Depot: a warehouse inventory control room (a Control room dashboard + a filterable Stock ledger). React/TypeScript client, FastAPI/SQLAlchemy/SQLite backend, SQLite database auto-created and seeded on first launch — no manual DB setup, external services, or API keys needed.

## Commands

```bash
pnpm install       # installs JS deps; Python deps are installed lazily by `uv run`
pnpm dev           # runs scripts/dev.mjs: Vite (5173) + uvicorn --reload (3100) side by side
pnpm build         # vite build
pnpm run check     # tsc --noEmit, then ruff check api && ty check api
```

Backend-only checks (run from repo root, not `api/`):

```bash
uv run ruff check api
uv run ty check api 
```

Client dev server: `http://localhost:5173`. API docs (Swagger UI): `http://localhost:3100/docs` (also `/redoc`, `/openapi.json`). Vite's dev proxy forwards `/api/*` and `/health` to `:3100` (see `vite.config.ts`), so the browser only ever talks to `5173` — don't hardcode `localhost:3100` in client code.

Package managers are **pnpm** (not npm/yarn) and **uv** (not pip/poetry) — `uv run <cmd>` auto-installs the pinned Python version and deps from `pyproject.toml`/`uv.lock` on first use. `uv run` is invoked with `--system-certs` in `scripts/dev.mjs` and should be kept when calling `uv` manually **on the Windows host**.

The cause is not the network: AVG Antivirus runs with HTTPS scanning enabled and MITMs every TLS connection, re-signing it with a locally generated root (`CN = AVG Web/Mail Shield Root`). Windows trusts that root, but `uv` ships its own CA bundle and doesn't, so it fails verification against PyPI. `--system-certs` tells `uv` to read the Windows trust store instead.

**This does not apply inside `.devcontainer/`** — that image installs the AVG root into the system trust store and sets `SSL_CERT_FILE`, so `uv` works there without `--system-certs`. Anything else with a private CA bundle (Node, Docker builds, WSL) hits the same wall on the host and needs the same treatment.

## Architecture

### Feature-folder pattern (both sides of the stack)

Frontend `src/pages/<feature>/` and backend `api/routes/<feature>/` both follow the same rule: a component/module lives in the feature folder unless more than one feature needs it, in which case it moves to the shared location.

- Frontend shared locations: `src/components/ui/` (shadcn/ui primitives), `src/components/common/` (cross-page pieces like `StatusBadge`, `AsyncState`), `src/components/layout/` (app chrome, e.g. `Topbar`). `src/hooks/`, `src/stores/`, `src/lib/`, `src/types/` are also shared.
- Backend shared locations: `api/models.py`, `api/schemas.py`, `api/database.py`, `api/seed.py` stay at the top level of `api/` since both features depend on them.

Within `api/routes/<feature>/`, each feature has its own three-layer chain: `routes.py` (HTTP/validation) → `service.py` (business logic, response shaping) → `queries.py` (SQLAlchemy queries). Only `products` has a `queries.py` — `dashboard/service.py` has no queries of its own, it aggregates by calling `api.routes.products.service.get_products` directly (a deliberate cross-feature import, not a layering violation).

Stock status (`In Stock` / `Low Stock` / `Out of Stock`) is **computed on every read** from `quantity` vs. `reorder_level` (`compute_status` in `api/routes/products/service.py`) — it is never stored on the `Product` model, so it can never drift out of sync with the numbers that produce it. Don't add a `status` column; if you need to filter/sort by status, do it after computing it.

### Data flow

Frontend: a page reads filter/current-page state from the Zustand `workspaceStore`, passes it to a React Query hook in `src/hooks/`, which calls `src/lib/apiClient.ts`, which hits the Vite-proxied `/api/*` route. `src/types/inventory.ts` mirrors the API's Pydantic schemas by hand — there's no codegen, so if you change a Pydantic schema's shape, update the TS type too.

Backend: `api/main.py`'s `lifespan` calls `create_schema()` + `seed_database()` on startup, so the SQLite file (`api/data/depot.db`, gitignored) is created and seeded automatically — delete it to reset to seed data.

### Styling

Tailwind CSS v4 (CSS-first config, no `tailwind.config.js` — tokens live in `src/styles/globals.css` under `@theme inline`) with hand-written shadcn/ui primitives in `src/components/ui/` (not installed via the shadcn CLI, since that fetches over the network). Light theme only; there is no dark mode.
