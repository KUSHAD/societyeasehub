import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type DraftMessageAttachment } from "~/lib/types";

interface MessageAttachmentStore {
  attachments: DraftMessageAttachment[];
  updateByChannel: (channelId: string, uri: string) => void;
  getByChannel: (channelId: string) => string[];
  clearByChannel: (channelId: string) => void;
  deleteByUri: (uri: string) => void;
}

export const useMessageAttachmentStore = create<MessageAttachmentStore>()(
  devtools(
    persist(
      (set, get) => ({
        attachments: [],
        updateByChannel(channelId, uri) {
          set((state) => ({
            attachments: [...state.attachments, { channelId, uri }],
          }));
        },
        getByChannel(channelId) {
          const attachments = get().attachments;
          const requiredAttachments = attachments
            .filter((_attachment) => _attachment.channelId === channelId)
            .map((_attachment) => _attachment.uri);
          return requiredAttachments;
        },
        clearByChannel(channelId) {
          set((state) => {
            const filteredAttachments = state.attachments.filter(
              (_attachment) => _attachment.channelId !== channelId,
            );
            return {
              attachments: filteredAttachments,
            };
          });
        },
        deleteByUri(uri) {
          set((state) => {
            const filteredAttachments = state.attachments.filter(
              (_attachment) => _attachment.uri !== uri,
            );
            return {
              attachments: filteredAttachments,
            };
          });
        },
      }),
      { name: "messageAttachment" },
    ),
  ),
);
