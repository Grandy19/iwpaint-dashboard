import { create } from 'zustand';

interface FilterState {
  dateRange: string;
  location: string;
  distributor: string;
  customer: string;
  sales: string;
  product: string;
  setDateRange: (range: string) => void;
  setLocation: (location: string) => void;
  setDistributor: (distributor: string) => void;
  setCustomer: (customer: string) => void;
  setSales: (sales: string) => void;
  setProduct: (product: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  dateRange: 'Juni 1 - Juni 30, 2026',
  location: 'Kabupaten Bandung',
  distributor: 'Semua Distributor',
  customer: 'Semua Customer',
  sales: 'Semua Sales',
  product: 'Semua Kategori',
  setDateRange: (range) => set({ dateRange: range }),
  setLocation: (location) => set({ location }),
  setDistributor: (distributor) => set({ distributor }),
  setCustomer: (customer) => set({ customer }),
  setSales: (sales) => set({ sales }),
  setProduct: (product) => set({ product }),
}));
