import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ShareModalStore {
  isOpen: boolean;
  uri: string;
  apiKey: string;
  onOpen: (uri: string, apiKey: string) => void;
  onClose: () => void;
}

export const useShareModalStore = create<ShareModalStore>()(
  devtools((set) => ({
    isOpen: false,
    uri: "",
    apiKey: "",
    onOpen: (uri, apiKey) => {
      set({
        isOpen: true,
        uri,
        apiKey,
      });
    },
    onClose: () => {
      set({
        isOpen: false,
        uri: "",
        apiKey: "",
      });
    },
  })),
);
