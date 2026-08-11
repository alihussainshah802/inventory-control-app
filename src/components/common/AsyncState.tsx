import { Loader2, PackageOpen, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface LoadingStateProps {
  label?: string
}

interface ErrorStateProps {
  onRetry: () => void
}

interface EmptyStateProps {
  hasFilters: boolean
  onClear: () => void
}

export function LoadingState({ label = 'Loading control room' }: LoadingStateProps) {
  return (
    <div
      className="flex min-h-60 items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm text-muted-foreground"
      role="status"
    >
      <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 text-center"
      role="alert"
    >
      <TriangleAlert className="size-6 text-destructive" strokeWidth={1.7} aria-hidden="true" />
      <div>
        <strong className="block text-base font-semibold text-foreground">
          Connection to the stock service failed
        </strong>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Check that the local API is running, then try again.
        </p>
      </div>
      <Button variant="link" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

export function EmptyState({ hasFilters, onClear }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-10 text-center">
      <PackageOpen className="mb-3 size-7 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
      <strong className="text-base font-semibold text-foreground">No stock items found</strong>
      <p className="mb-1 text-sm text-muted-foreground">
        {hasFilters
          ? 'Try changing or clearing the current filters.'
          : 'Items will appear here once they are added to the warehouse.'}
      </p>
      {hasFilters && (
        <Button variant="link" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
