import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface APIKey {
  key: string;
  societyId: string;
}

interface APIKeyStore {
  apiKeys: APIKey[];
  setAPIKey: (key: string, societyId: string) => void;
  getAPIKey: (societyId: string) => string;
}

export const useAPIKeyStore = create<APIKeyStore>()(
  devtools(
    persist(
      (set, get) => ({
        apiKeys: [],
        setAPIKey: (key, societyId) => {
          set((state) => ({
            apiKeys: [...state.apiKeys, { key, societyId }],
          }));
        },
        getAPIKey: (societyId) => {
          const keys = get().apiKeys;
          const requiredKey = keys.find(
            (_key) => _key.societyId === societyId,
          )?.key;
          return requiredKey ?? "";
        },
      }),
      { name: "apiKeys" },
    ),
  ),
);
