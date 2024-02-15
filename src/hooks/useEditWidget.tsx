import { create } from "zustand";
import { Layout_Widgets } from "@prisma/client";

interface EditWidgetStore {
  isOpen: boolean;
  widget: Layout_Widgets | undefined;
  setOpen: (open: boolean, widget: Layout_Widgets | undefined) => void;
}

export const useEditWidget = create<EditWidgetStore>((set) => ({
  isOpen: false,
  widget: undefined,
  setOpen: (open: boolean, widget = undefined) => set((state) => ({...state, isOpen: open, widget: widget })),
}));
