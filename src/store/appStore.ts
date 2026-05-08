import { create } from 'zustand';

interface AppState {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeMenu: 'khach-hang',
  setActiveMenu: (menu) => set({ activeMenu: menu }),
}));
