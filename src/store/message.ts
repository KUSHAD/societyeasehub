import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type DraftMessage } from "~/lib/types";

interface MessageStore {
  messages: DraftMessage[];
  updateByChannel: (channelId: string, content: string) => void;
  getByChannel: (channelId: string) => string;
}

export const useMessageStore = create<MessageStore>()(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        updateByChannel(channelId, content) {
          set((state) => {
            const filteredMessage = state.messages.filter(
              (_message) => _message.channelId !== channelId,
            );
            return {
              messages: [...filteredMessage, { channelId, content }],
            };
          });
        },
        getByChannel(channelId) {
          const messages = get().messages;
          const requiredMessage = messages.find(
            (_message) => _message.channelId === channelId,
          )?.content;
          return requiredMessage ?? "";
        },
      }),
      { name: "message" },
    ),
  ),
);
