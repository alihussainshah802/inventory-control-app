import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/useProducts'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { ErrorState, LoadingState } from '@/components/common/AsyncState'
import { ProductFilters } from './ProductFilters'
import { ProductsTable } from './ProductsTable'

export function ProductsPage() {
  const filters = useWorkspaceStore((state) => state.productFilters)
  const setFilter = useWorkspaceStore((state) => state.setProductFilter)
  const clearFilters = useWorkspaceStore((state) => state.clearProductFilters)
  const products = useProducts(filters.status)

  return (
    <section className="animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Stock ledger
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Stock
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Track quantity, value and reorder status across every location.
          </p>
        </div>
        <Button variant="secondary" type="button">
          <Download size={15} aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      <section aria-label="Stock items">
        <div className="mb-4.5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">All stock</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {products.data ? `${products.data.length} results` : 'Loading results'}
            </p>
          </div>
          <ProductFilters filters={filters} onChange={setFilter} />
        </div>

        {products.isPending && <LoadingState label="Loading stock" />}
        {products.isError && <ErrorState onRetry={products.refetch} />}
        {products.isSuccess && (
          <ProductsTable products={products.data} filters={filters} onClear={clearFilters} />
        )}
      </section>
    </section>
  )
}
