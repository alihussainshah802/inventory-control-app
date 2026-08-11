from collections.abc import Sequence

from sqlalchemy import Select, desc, select
from sqlalchemy.orm import Session, joinedload

from api.models import Product


def list_products(session: Session) -> Sequence[Product]:
    statement: Select[tuple[Product]] = (
        select(Product)
        .options(joinedload(Product.category), joinedload(Product.location))
        .order_by(desc(Product.updated_at), desc(Product.id))
    )

    return session.scalars(statement).all()
