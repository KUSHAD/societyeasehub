import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { DraftAnnouncement } from "~/lib/types";

interface AnnouncementStore {
  announcements: DraftAnnouncement[];
  updateBySociety: (societyId: string, content: string) => void;
  getBySociety: (societyId: string) => string;
}

export const useAnnouncementStore = create<AnnouncementStore>()(
  devtools(
    persist(
      (set, get) => ({
        announcements: [],
        updateBySociety(societyId, content) {
          set((state) => {
            const filteredAnnouncement = state.announcements.filter(
              (_announcement) => _announcement.societyId !== societyId,
            );
            return {
              announcements: [...filteredAnnouncement, { societyId, content }],
            };
          });
        },
        getBySociety(societyId) {
          const announcements = get().announcements;
          const requiredMessage = announcements.find(
            (_announcement) => _announcement.societyId === societyId,
          )?.content;
          return requiredMessage ?? "";
        },
      }),
      { name: "announcement" },
    ),
  ),
);
