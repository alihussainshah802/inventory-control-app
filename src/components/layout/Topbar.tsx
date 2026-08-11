import { Bell, Boxes, LayoutGrid, PackageSearch } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import type { LucideIcon } from 'lucide-react'
import type { Page } from '../../types/inventory'

const links: Array<{ id: Page; label: string; icon: LucideIcon }> = [
  { id: 'dashboard', label: 'Control room', icon: LayoutGrid },
  { id: 'products', label: 'Stock', icon: PackageSearch },
]

export function Topbar() {
  const currentPage = useWorkspaceStore((state) => state.currentPage)
  const setCurrentPage = useWorkspaceStore((state) => state.setCurrentPage)

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[62px] max-w-[1320px] items-center gap-7 px-4 sm:px-8">
        <button
          className="flex items-center gap-2.5 whitespace-nowrap text-base font-bold tracking-tight text-foreground"
          type="button"
          onClick={() => setCurrentPage('dashboard')}
          aria-label="Open control room"
        >
          <span className="grid size-[30px] place-items-center rounded-lg bg-primary text-primary-foreground">
            <Boxes size={18} strokeWidth={2} />
          </span>
          <span>
            Depot
            <span className="ml-1.5 rounded border border-primary/40 px-1.5 py-0.5 align-middle font-mono text-[9px] font-bold tracking-widest text-primary">
              OPS
            </span>
          </span>
        </button>

        <nav className="flex items-center gap-0.5" aria-label="Workspace">
          {links.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(id)}
              aria-current={currentPage === id ? 'page' : undefined}
              className={cn(
                'h-8 gap-2 rounded-md px-3 font-semibold text-muted-foreground',
                currentPage === id && 'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
            >
              <Icon size={16} strokeWidth={2} aria-hidden="true" />
              {label}
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <button
            className="relative grid size-[34px] place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
            type="button"
            aria-label="Alerts"
          >
            <Bell size={17} strokeWidth={2} />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full border border-card bg-destructive" />
          </button>
          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="grid size-[30px] place-items-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
              MC
            </span>
            <div className="leading-tight">
              <strong className="block text-xs font-semibold text-foreground">Marcus Chen</strong>
              <span className="block text-[10.5px] text-muted-foreground">Warehouse ops</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
