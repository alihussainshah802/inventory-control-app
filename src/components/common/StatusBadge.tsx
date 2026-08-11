import { Badge } from '@/components/ui/badge'
import type { StockStatus } from '../../types/inventory'

interface StatusBadgeProps {
  status: StockStatus
}

const statusVariant: Record<StockStatus, 'success' | 'warning' | 'destructive'> = {
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'destructive',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </Badge>
  )
}
