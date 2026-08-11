from typing import Annotated, TypeAlias

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from api.database import get_session
from api.routes.products.service import get_products
from api.schemas import ProductRead

router = APIRouter(prefix="/products", tags=["products"])
# The PEP 695 `type` statement ruff suggests here breaks FastAPI's dependency
# resolution at runtime (it can't unwrap the resulting TypeAliasType).
DatabaseSession: TypeAlias = Annotated[Session, Depends(get_session)]  # noqa: UP040


@router.get(
    "",
    response_model=list[ProductRead],
    summary="List stock",
    description="Returns every tracked product, each with a stock status computed from "
    "quantity vs. reorder level.",
    response_description="Products ordered by most recently updated first.",
)
def products_index(
    session: DatabaseSession,
    status: Annotated[
        str | None,
        Query(
            max_length=20,
            description='Filter by status: "In Stock", "Low Stock", or "Out of Stock". '
            'Omit or pass "All" for every product.',
            examples=["Low Stock"],
        ),
    ] = None,
) -> list[ProductRead]:
    return get_products(session, status)
