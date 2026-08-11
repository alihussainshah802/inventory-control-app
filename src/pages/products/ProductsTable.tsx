import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import type { Product, ProductFilters, ProductSort } from '@/types/inventory'
import { EmptyState } from '@/components/common/AsyncState'
import { StatusBadge } from '@/components/common/StatusBadge'

interface ProductsTableProps {
  products: Product[]
  filters: ProductFilters
  onClear: () => void
}

function matchesSearch(product: Product, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase()
  if (!normalizedSearch) return true

  return [product.sku, product.name, product.category, product.location].some((value) =>
    value.toLowerCase().includes(normalizedSearch),
  )
}

function sortProducts(products: Product[], sort: ProductSort): Product[] {
  return products.toSorted((left, right) => {
    if (sort === 'name') return left.name.localeCompare(right.name)
    if (sort === 'qty-high') return right.quantity - left.quantity
    if (sort === 'qty-low') return left.quantity - right.quantity
    return right.updated_at.localeCompare(left.updated_at)
  })
}

export function ProductsTable({ products, filters, onClear }: ProductsTableProps) {
  const visibleProducts = sortProducts(
    products.filter((product) => matchesSearch(product, filters.search)),
    filters.sort,
  )
  const hasFilters =
    filters.search !== '' || filters.status !== 'All' || filters.sort !== 'updated'

  if (visibleProducts.length === 0) {
    return <EmptyState hasFilters={hasFilters} onClear={onClear} />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Unit cost</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid size-[30px] shrink-0 place-items-center rounded-md bg-primary/15 font-mono text-[13px] font-bold text-primary"
                    aria-hidden="true"
                  >
                    {product.category.slice(0, 1)}
                  </span>
                  <span>
                    <strong className="block font-semibold text-foreground">
                      {product.name}
                    </strong>
                    <span className="font-mono text-xs text-muted-foreground">{product.sku}</span>
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{product.location}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(product.updated_at)}</TableCell>
              <TableCell>
                <StatusBadge status={product.status} />
              </TableCell>
              <TableCell className="text-right font-mono">{formatNumber(product.quantity)}</TableCell>
              <TableCell className="text-right font-mono text-muted-foreground">
                {formatCurrency(product.unit_cost)}
              </TableCell>
              <TableCell className="text-right font-semibold text-foreground">
                {formatCurrency(product.total_value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
