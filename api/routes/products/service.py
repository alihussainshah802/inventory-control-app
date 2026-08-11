from sqlalchemy.orm import Session

from api.models import Product
from api.routes.products.queries import list_products as find_products
from api.schemas import ProductRead, StockStatus


def compute_status(product: Product) -> StockStatus:
    if product.quantity <= 0:
        return "Out of Stock"
    if product.quantity <= product.reorder_level:
        return "Low Stock"
    return "In Stock"


def to_product_read(product: Product) -> ProductRead:
    unit_cost = float(product.unit_cost)
    return ProductRead(
        id=product.id,
        sku=product.sku,
        name=product.name,
        category=product.category.name,
        location=product.location.name,
        quantity=product.quantity,
        reorder_level=product.reorder_level,
        unit_cost=unit_cost,
        total_value=round(unit_cost * product.quantity, 2),
        updated_at=product.updated_at,
        status=compute_status(product),
    )


def get_products(session: Session, status: str | None = None) -> list[ProductRead]:
    products = [to_product_read(product) for product in find_products(session)]
    if status and status != "All":
        products = [product for product in products if product.status == status]
    return products
