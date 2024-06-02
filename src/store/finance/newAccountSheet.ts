import { create } from "zustand";

interface NewAccountSheetStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNewAccountSheetStore = create<NewAccountSheetStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
