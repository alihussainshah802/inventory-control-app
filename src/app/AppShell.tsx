import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProductsPage } from '@/pages/products/ProductsPage'
import { Topbar } from '@/components/layout/Topbar'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export function AppShell() {
  const currentPage = useWorkspaceStore((state) => state.currentPage)

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="mx-auto max-w-[1320px] px-4 pb-20 pt-8 sm:px-8 sm:pt-12">
        {currentPage === 'dashboard' ? <DashboardPage /> : <ProductsPage />}
      </main>
    </div>
  )
}
