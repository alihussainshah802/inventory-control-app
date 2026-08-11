from collections.abc import Sequence

from sqlalchemy.orm import Session

from api.routes.products.service import get_products
from api.schemas import DashboardRead, InventoryTotals, ProductRead, StockStatus


def sum_value(products: Sequence[ProductRead], status: StockStatus) -> float:
    return round(sum(product.total_value for product in products if product.status == status), 2)


def get_dashboard(session: Session) -> DashboardRead:
    products = get_products(session)
    reorder_count = sum(product.status in ("Low Stock", "Out of Stock") for product in products)

    return DashboardRead(
        totals=InventoryTotals(
            total_value=round(sum(product.total_value for product in products), 2),
            in_stock_value=sum_value(products, "In Stock"),
            low_stock_value=sum_value(products, "Low Stock"),
        ),
        sku_count=len(products),
        reorder_count=reorder_count,
        recent_products=products[:5],
    )
