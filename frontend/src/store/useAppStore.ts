import { create } from 'zustand';
import type { TabKey, FilterOptions } from '@/types';

interface AppState {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;

  filters: FilterOptions;
  setYear: (year: number) => void;
  setYearRange: (start: number, end: number) => void;
  setRegions: (regions: string[]) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  filters: {
    year: 2024,
    startYear: 2015,
    endYear: 2024,
    region: [],
    population: [],
    educationLevels: [],
  },

  setYear: (year) =>
    set((state) => ({ filters: { ...state.filters, year } })),

  setYearRange: (start, end) =>
    set((state) => ({
      filters: { ...state.filters, startYear: start, endYear: end },
    })),

  setRegions: (regions) =>
    set((state) => ({ filters: { ...state.filters, region: regions } })),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
