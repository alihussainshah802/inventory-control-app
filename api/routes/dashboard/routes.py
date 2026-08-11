from typing import Annotated, TypeAlias

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.database import get_session
from api.routes.dashboard.service import get_dashboard
from api.schemas import DashboardRead

router = APIRouter(prefix="/dashboard", tags=["dashboard"])
# The PEP 695 `type` statement ruff suggests here breaks FastAPI's dependency
# resolution at runtime (it can't unwrap the resulting TypeAliasType).
DatabaseSession: TypeAlias = Annotated[Session, Depends(get_session)]  # noqa: UP040


@router.get(
    "",
    response_model=DashboardRead,
    summary="Control room summary",
    description="Aggregates stock value totals, the reorder queue count, and the 5 most "
    "recently updated products.",
)
def dashboard_index(session: DatabaseSession) -> DashboardRead:
    return get_dashboard(session)
