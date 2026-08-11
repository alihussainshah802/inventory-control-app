import { Search, SlidersHorizontal } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProductFilters as ProductFilterValues, ProductSort, StockStatusFilter } from '@/types/inventory'

interface ProductFiltersProps {
  filters: ProductFilterValues
  onChange: <Key extends keyof ProductFilterValues>(
    name: Key,
    value: ProductFilterValues[Key],
  ) => void
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  return (
    <div className="flex w-full max-w-[680px] flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-end">
      <div className="relative flex-1 sm:min-w-[220px] sm:flex-[1_1_260px]">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search SKU, item or category"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          className="pl-9"
          aria-label="Search stock"
        />
      </div>
      <div className="grid grid-cols-[18px_1fr_1fr] items-center gap-1.5 sm:flex">
        <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
        <Select
          value={filters.status}
          onValueChange={(value) => onChange('status', value as StockStatusFilter)}
        >
          <SelectTrigger aria-label="Filter by status" className="w-full sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            <SelectItem value="In Stock">In Stock</SelectItem>
            <SelectItem value="Low Stock">Low Stock</SelectItem>
            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.sort}
          onValueChange={(value) => onChange('sort', value as ProductSort)}
        >
          <SelectTrigger aria-label="Sort stock" className="w-full sm:w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Recently updated</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="qty-high">Quantity: high to low</SelectItem>
            <SelectItem value="qty-low">Quantity: low to high</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
