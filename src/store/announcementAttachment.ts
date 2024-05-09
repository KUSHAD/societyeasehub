import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type DraftAnnouncementAttachment } from "~/lib/types";

interface AnnouncementAttachmentStore {
  attachments: DraftAnnouncementAttachment[];
  updateBySociety: (societyId: string, uri: string) => void;
  getBySociety: (societyId: string) => string[];
  clearBySociety: (societyId: string) => void;
  deleteByUri: (uri: string) => void;
}

export const useAnnouncementAttachmentStore =
  create<AnnouncementAttachmentStore>()(
    devtools(
      persist(
        (set, get) => ({
          attachments: [],
          updateBySociety(societyId, uri) {
            set((state) => ({
              attachments: [...state.attachments, { societyId, uri }],
            }));
          },
          getBySociety(societyId) {
            const attachments = get().attachments;
            const requiredAttachments = attachments
              .filter((_attachment) => _attachment.societyId === societyId)
              .map((_attachment) => _attachment.uri);
            return requiredAttachments;
          },
          clearBySociety(societyId) {
            set((state) => {
              const filteredAttachments = state.attachments.filter(
                (_attachment) => _attachment.societyId !== societyId,
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
        { name: "announcementAttachment" },
      ),
    ),
  );
