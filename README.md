# Depot

Depot is a warehouse inventory control room: a Control room dashboard and a filterable Stock ledger, built with React, TypeScript, Tailwind CSS, shadcn/ui, FastAPI, SQLAlchemy and SQLite.

The local SQLite database is created and seeded automatically on first launch. Python and project dependencies are managed by `uv`; no manual virtual environment, database server, external service or API key is required.

## Stack

| Layer | Technology |
| --- | --- |
| UI | React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix primitives), lucide-react |
| Client state | Zustand (current page, filters) |
| Server state | TanStack React Query |
| API | FastAPI |
| Data | SQLAlchemy ORM over SQLite |
| Tooling | Vite, pnpm, uv, ruff, ty |

## Run it

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:3100`; Vite proxies `/api` and `/health` to it, so the client never talks to port 3100 directly.

Use Node.js 22 and install [`uv`](https://docs.astral.sh/uv/getting-started/installation/) before starting. `uv run` installs the pinned Python version and dependencies automatically.

Interactive API docs (Swagger UI) are served by FastAPI at `http://localhost:3100/docs`, with ReDoc at `/redoc` and the raw OpenAPI schema at `/openapi.json`.

## Architecture overview

`pnpm dev` (via `scripts/dev.mjs`) starts two processes side by side: Vite serves the React client on `5173`, and `uv run uvicorn` serves the FastAPI app on `3100`. Vite's dev proxy forwards `/api/*` and `/health` to the API, so the browser only ever talks to `5173`.

```
Browser  ── /api/*, /health ──►  Vite (5173, proxy)  ──►  FastAPI (3100)
                                        │                       │
                                  React app (SPA)          SQLAlchemy ── SQLite (api/data/depot.db)
```

### Frontend (`src/`)

Organized by feature first, shared code second — a component only lives in `components/` if more than one page uses it; otherwise it stays next to the page that owns it.

```
src/
  app/            App.tsx (QueryClientProvider) + AppShell.tsx (top-level layout, page switch)
  pages/
    dashboard/    DashboardPage.tsx — only used on the Control room page
    products/     ProductsPage.tsx, ProductFilters.tsx, ProductsTable.tsx — only used on the Stock page
  components/
    layout/       Topbar.tsx — app chrome, rendered once by AppShell
    common/       AsyncState.tsx, StatusBadge.tsx — reused by both pages
    ui/           shadcn/ui primitives (button, card, badge, input, select, table)
  hooks/          useDashboard.ts, useProducts.ts — React Query wrappers around apiClient
  stores/         workspaceStore.ts — Zustand store for current page + product filters
  lib/            apiClient.ts (fetch wrappers), formatters.ts, utils.ts (cn helper)
  types/          inventory.ts — shared TypeScript types, mirrors the API's Pydantic schemas
  styles/         globals.css — Tailwind import + shadcn design tokens (light theme)
```

Data flow: a page reads filter state from `workspaceStore`, passes it to a `hooks/` React Query hook, which calls `lib/apiClient.ts`, which hits the proxied `/api/*` route.

### Backend (`api/`)

Feature-folder structure mirroring the frontend's `pages/` split. Each route folder holds only the layers that route actually calls; cross-cutting pieces (ORM models, Pydantic schemas, DB session, seed data) stay at the top level since both features depend on them.

```
api/
  main.py              FastAPI app, lifespan (create schema + seed), router registration
  database.py           SQLAlchemy engine/session setup
  models.py             Category, Location, Product (ORM)
  schemas.py             ProductRead, InventoryTotals, DashboardRead (Pydantic)
  seed.py                 Seed data for a fresh database
  routes/
    products/
      routes.py           GET /api/products?status=  → service.get_products
      service.py           get_products, compute_status, to_product_read
      queries.py            list_products (SQLAlchemy query)
    dashboard/
      routes.py           GET /api/dashboard  → service.get_dashboard
      service.py           get_dashboard, sum_value (calls routes.products.service.get_products)
```

Each route follows the same three-layer call chain: `routes.py` (HTTP, validation) → `service.py` (business logic, shaping the response) → `queries.py` (SQLAlchemy query, products only — the dashboard has no queries of its own, it aggregates products).

### API endpoints

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/health` | `{ status, runtime }` liveness check |
| GET | `/api/dashboard` | Totals, reorder count, 5 most recently updated products |
| GET | `/api/products?status=` | Product list, optionally filtered by `In Stock` / `Low Stock` / `Out of Stock` (omit or `All` for everything) |

Stock status (`In Stock` / `Low Stock` / `Out of Stock`) is computed from `quantity` vs. `reorder_level` on every read — it's never stored, so it can't drift out of sync with the numbers that produce it.
