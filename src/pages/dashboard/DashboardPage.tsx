import {
  ArrowRight,
  PackageCheck,
  PackageMinus,
  PackageSearch,
  Tag,
  TriangleAlert,
  Wallet,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { ErrorState, LoadingState } from '@/components/common/AsyncState'
import { StatusBadge } from '@/components/common/StatusBadge'

export function DashboardPage() {
  const dashboard = useDashboard()
  const setCurrentPage = useWorkspaceStore((state) => state.setCurrentPage)

  if (dashboard.isPending) return <LoadingState />
  if (dashboard.isError) return <ErrorState onRetry={dashboard.refetch} />

  const { totals, sku_count, reorder_count, recent_products } = dashboard.data

  const statTiles = [
    {
      label: 'Total stock value',
      value: formatCurrency(totals.total_value),
      icon: Wallet,
      accent: true,
    },
    {
      label: 'In-stock value',
      value: formatCurrency(totals.in_stock_value),
      icon: PackageCheck,
      iconClass: 'bg-success/15 text-success',
    },
    {
      label: 'Low-stock value',
      value: formatCurrency(totals.low_stock_value),
      icon: PackageMinus,
      iconClass: 'bg-warning/15 text-warning',
    },
    {
      label: 'Tracked SKUs',
      value: formatNumber(sku_count),
      icon: Tag,
    },
  ]

  return (
    <section className="animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Live status &middot; Aug 11, 2026
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Control room
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            A read on every SKU across the network, updated in real time.
          </p>
        </div>
        <Button onClick={() => setCurrentPage('products')}>
          Open stock table
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {statTiles.map(({ label, value, icon: Icon, accent, iconClass }) => (
          <Card
            key={label}
            className={cn(accent && 'border-primary/35 bg-gradient-to-br from-primary/10 to-card')}
          >
            <CardContent className="pt-5">
              <div
                className={cn(
                  'mb-3.5 grid size-[30px] place-items-center rounded-md bg-primary/15 text-primary',
                  iconClass,
                )}
              >
                <Icon size={18} aria-hidden="true" />
              </div>
              <span className="text-[11.5px] font-semibold text-muted-foreground">{label}</span>
              <p className="mt-2.5 font-mono text-2xl font-semibold tracking-tight text-foreground">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-3.5 border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-wrap items-center gap-4 py-4.5">
          <div className="grid size-[38px] shrink-0 place-items-center rounded-lg bg-destructive/12 text-destructive">
            <TriangleAlert size={20} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Reorder queue
            </p>
            <span className="mr-2 font-mono text-xl font-bold text-foreground">
              {reorder_count}
            </span>
            <span className="text-sm text-muted-foreground">
              SKUs are low or out of stock and need a purchase order.
            </span>
          </div>
          <Button variant="link" onClick={() => setCurrentPage('products')}>
            Review queue <ArrowRight size={15} aria-hidden="true" />
          </Button>
        </CardContent>
      </Card>

      <section className="mt-11">
        <div className="mb-4 flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Latest movement
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              Recently updated stock
            </h2>
          </div>
          <Button variant="link" onClick={() => setCurrentPage('products')}>
            View all <ArrowRight size={15} aria-hidden="true" />
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent_products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    <strong className="block font-semibold text-foreground">
                      {product.name}
                    </strong>
                    <span className="text-xs text-muted-foreground">{product.category}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.location}</TableCell>
                  <TableCell>
                    <StatusBadge status={product.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(product.quantity)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {formatCurrency(product.total_value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <p className="mt-6 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <PackageSearch size={13} aria-hidden="true" /> Updated automatically as stock moves through
        the network.
      </p>
    </section>
  )
}
