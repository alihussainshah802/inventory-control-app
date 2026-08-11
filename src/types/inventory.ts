export type Page = 'dashboard' | 'products'
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock'
export type StockStatusFilter = 'All' | StockStatus
export type ProductSort = 'updated' | 'name' | 'qty-high' | 'qty-low'

export interface Product {
  id: number
  sku: string
  name: string
  category: string
  location: string
  quantity: number
  reorder_level: number
  unit_cost: number
  total_value: number
  updated_at: string
  status: StockStatus
}

export interface ProductFilters {
  search: string
  status: StockStatusFilter
  sort: ProductSort
}

export interface InventoryTotals {
  total_value: number
  in_stock_value: number
  low_stock_value: number
}

export interface Dashboard {
  totals: InventoryTotals
  sku_count: number
  reorder_count: number
  recent_products: Product[]
}
