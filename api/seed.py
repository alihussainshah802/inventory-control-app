from datetime import date
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from api.models import Category, Location, Product

CATEGORIES = [
    {"name": "Electronics"},
    {"name": "Packaging"},
    {"name": "Raw Materials"},
    {"name": "Tools"},
]

LOCATIONS = [
    {"name": "Warehouse A"},
    {"name": "Warehouse B"},
    {"name": "Overflow Yard"},
]

# category_id, location_id, sku, name, quantity, reorder_level, unit_cost, updated_at
PRODUCTS = [
    (1, 1, "EL-1042", "USB-C Power Module", 18, 40, "6.80", date(2026, 8, 8)),
    (2, 2, "PK-3301", "Corrugated Mailer, Medium", 640, 200, "0.42", date(2026, 8, 7)),
    (3, 3, "RM-0087", "Aluminium Sheet 2mm", 0, 15, "23.10", date(2026, 8, 6)),
    (4, 1, "TL-1120", "Torque Driver Set", 26, 10, "34.50", date(2026, 8, 6)),
    (1, 1, "EL-2207", "Bluetooth Sensor Board", 9, 25, "12.25", date(2026, 8, 5)),
    (2, 2, "PK-3355", "Bubble Wrap Roll 50m", 54, 20, "8.90", date(2026, 8, 4)),
    (3, 3, "RM-0142", "Steel Rod 1m", 310, 100, "3.15", date(2026, 8, 3)),
    (4, 2, "TL-1188", "Cordless Drill", 4, 8, "58.00", date(2026, 8, 2)),
    (1, 1, "EL-1099", "HDMI Cable 2m", 210, 60, "2.40", date(2026, 8, 1)),
    (2, 1, "PK-3410", "Pallet Wrap Film", 0, 30, "11.75", date(2026, 7, 30)),
    (3, 2, "RM-0203", "Copper Wire Spool", 72, 25, "17.60", date(2026, 7, 29)),
    (4, 3, "TL-1240", "Safety Goggles (Box of 12)", 48, 15, "22.00", date(2026, 7, 27)),
]


def seed_database(session: Session) -> None:
    if session.scalar(select(func.count()).select_from(Product)):
        return

    session.add_all(Category(**category) for category in CATEGORIES)
    session.add_all(Location(**location) for location in LOCATIONS)
    session.flush()

    session.add_all(
        Product(
            category_id=category_id,
            location_id=location_id,
            sku=sku,
            name=name,
            quantity=quantity,
            reorder_level=reorder_level,
            unit_cost=Decimal(unit_cost),
            updated_at=updated_at,
        )
        for category_id, location_id, sku, name, quantity, reorder_level, unit_cost, updated_at in PRODUCTS
    )
