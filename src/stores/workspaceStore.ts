import { create } from 'zustand'

import type { Page, ProductFilters } from '../types/inventory'

interface WorkspaceState {
  currentPage: Page
  setCurrentPage: (currentPage: Page) => void
  productFilters: ProductFilters
  setProductFilter: <Key extends keyof ProductFilters>(
    name: Key,
    value: ProductFilters[Key],
  ) => void
  clearProductFilters: () => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentPage: 'dashboard',
  setCurrentPage: (currentPage) => set({ currentPage }),
  productFilters: {
    search: '',
    status: 'All',
    sort: 'updated',
  },
  setProductFilter: (name, value) =>
    set((state) => ({
      productFilters: { ...state.productFilters, [name]: value },
    })),
  clearProductFilters: () =>
    set({
      productFilters: { search: '', status: 'All', sort: 'updated' },
    }),
}))
