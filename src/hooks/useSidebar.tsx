import { create } from "zustand";
import { Layout } from "@prisma/client";

interface SidebarStore {
  isOpen: boolean;
  layouts: Layout[];
  selectedLayout: number;
  toggle: () => void;
  setLayouts: (layouts: Layout[]) => void;
  setSelectedLayout: (selectedLayout: number) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  layouts: [],
  selectedLayout: 0,
  toggle: () => set((state) => ({...state, isOpen: !state.isOpen })),
  setLayouts: (layouts: Layout[]) => set((state) => ({...state, layouts })),
  setSelectedLayout: (selectedLayout: number) => set((state) => ({...state, selectedLayout: state.selectedLayout !== selectedLayout ? selectedLayout : state.selectedLayout})),
}));
