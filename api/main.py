from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from api.database import create_schema, session_scope
from api.routes.dashboard.routes import router as dashboard_router
from api.routes.products.routes import router as products_router
from api.schemas import HealthRead
from api.seed import seed_database

TAGS_METADATA = [
    {
        "name": "dashboard",
        "description": "Aggregate stock value and reorder queue summary for the Control room page.",
    },
    {
        "name": "products",
        "description": "Per-SKU stock records backing the Stock ledger page.",
    },
    {"name": "system", "description": "Operational endpoints not tied to a page."},
]


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
    create_schema()
    with session_scope() as session:
        seed_database(session)
    yield


app = FastAPI(
    title="Depot API",
    description="Backend for Depot, a warehouse inventory control room. Serves the Control "
    "room dashboard and the filterable Stock ledger.",
    version="1.0.0",
    lifespan=lifespan,
    openapi_tags=TAGS_METADATA,
)
app.include_router(dashboard_router, prefix="/api")
app.include_router(products_router, prefix="/api")


@app.get(
    "/health",
    tags=["system"],
    response_model=HealthRead,
    summary="Liveness check",
)
def healthcheck() -> HealthRead:
    return HealthRead(status="ok", runtime="python")
