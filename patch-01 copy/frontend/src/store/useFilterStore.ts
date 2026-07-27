import { create } from 'zustand';

interface FilterState {
  startDate: string;
  endDate: string;
  location: string;
  customer: string;
  sales: string;
  product: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setLocation: (location: string) => void;
  setCustomer: (customer: string) => void;
  setSales: (sales: string) => void;
  setProduct: (product: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  startDate: '01 Juli 2026',
  endDate: '30 Juni 2026',
  location: 'Semua Lokasi',
  customer: 'Semua Customer',
  sales: 'Semua Sales',
  product: 'Semua Kategori',
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setLocation: (location) => set({ location }),
  setCustomer: (customer) => set({ customer }),
  setSales: (sales) => set({ sales }),
  setProduct: (product) => set({ product }),
}));
