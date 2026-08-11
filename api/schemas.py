from datetime import date
from typing import Literal

from pydantic import BaseModel, Field

StockStatus = Literal["In Stock", "Low Stock", "Out of Stock"]
"""Computed from `quantity` vs. `reorder_level` on every read; never stored."""


class ProductRead(BaseModel):
    id: int = Field(description="Internal database id.", examples=[1])
    sku: str = Field(description="Stock keeping unit code.", examples=["EL-1042"])
    name: str = Field(description="Human-readable product name.", examples=["USB-C Power Module"])
    category: str = Field(examples=["Electronics"])
    location: str = Field(description="Warehouse or yard where the stock is held.", examples=["Warehouse A"])
    quantity: int = Field(description="Units currently on hand.", examples=[18])
    reorder_level: int = Field(description="Quantity threshold that triggers Low Stock status.", examples=[40])
    unit_cost: float = Field(description="Cost per unit, in USD.", examples=[6.8])
    total_value: float = Field(description="`quantity * unit_cost`, rounded to 2 decimals.", examples=[122.4])
    updated_at: date = Field(description="Date this product's stock was last updated.")
    status: StockStatus = Field(description="Derived stock status.", examples=["Low Stock"])


class InventoryTotals(BaseModel):
    total_value: float = Field(description="Sum of `total_value` across all products.", examples=[5914.75])
    in_stock_value: float = Field(description="Sum of `total_value` for In Stock products.", examples=[5450.10])
    low_stock_value: float = Field(description="Sum of `total_value` for Low Stock products.", examples=[464.65])


class DashboardRead(BaseModel):
    totals: InventoryTotals
    sku_count: int = Field(description="Total number of distinct SKUs tracked.", examples=[12])
    reorder_count: int = Field(
        description="Number of SKUs that are Low Stock or Out of Stock.", examples=[5]
    )
    recent_products: list[ProductRead] = Field(
        description="The 5 most recently updated products, newest first."
    )


class HealthRead(BaseModel):
    status: Literal["ok"] = Field(examples=["ok"])
    runtime: str = Field(description="Language runtime serving the API.", examples=["python"])
