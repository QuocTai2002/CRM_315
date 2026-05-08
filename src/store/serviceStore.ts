import { create } from 'zustand';

interface ServiceStore {
  selectedServices: string[];
  toggleService: (id: string) => void;
  clearServices: () => void;
  setServices: (ids: string[]) => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  selectedServices: [],
  toggleService: (id) =>
    set((state) => ({
      selectedServices: state.selectedServices.includes(id)
        ? state.selectedServices.filter((s) => s !== id)
        : [...state.selectedServices, id],
    })),
  clearServices: () => set({ selectedServices: [] }),
  setServices: (ids) => set({ selectedServices: ids }),
}));
