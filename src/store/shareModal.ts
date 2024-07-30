import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ShareModalStore {
  isOpen: boolean;
  uri: string;
  onOpen: (uri: string) => void;
  onClose: () => void;
}

export const useShareModalStore = create<ShareModalStore>()(
  devtools((set) => ({
    isOpen: false,
    uri: "",
    onOpen: (uri) => {
      set({
        isOpen: true,
        uri,
      });
    },
    onClose: () => {
      set({
        isOpen: false,
        uri: "",
      });
    },
  })),
);
