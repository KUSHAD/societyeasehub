"use server";

import { z } from "zod";
import { safeAction } from "~/lib/safe-action";
import { utapi } from "~/server/storage";

export const deleteDraftAttachment = safeAction(
  z.object({
    uri: z.string().url(),
  }),
  async ({ uri }) => {
    try {
      const fileKey = uri.split("/f/")[1]!;
      await utapi.deleteFiles(fileKey);
      return {
        success: "Deleted Attachment",
      };
    } catch (error) {
      if (error instanceof Error) return { failure: error.message };
    }
  },
);
