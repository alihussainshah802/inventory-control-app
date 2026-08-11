import type { Dashboard, Product, StockStatusFilter } from '../types/inventory'

async function get<Result>(path: string): Promise<Result> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error('The inventory service could not be reached.')
  }
  return response.json()
}

export function fetchDashboard(): Promise<Dashboard> {
  return get<Dashboard>('/api/dashboard')
}

export function fetchProducts(status: StockStatusFilter): Promise<Product[]> {
  const search = new URLSearchParams({ status })
  return get<Product[]>(`/api/products?${search}`)
}
