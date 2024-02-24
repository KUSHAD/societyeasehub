"use server";

import { z } from "zod";
import { safeAction } from "~/lib/safe-action";
import { utapi } from "~/server/storage";

export const deleteDraftMessageAttachment = safeAction(
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { failure: error.message };
    }
  },
);
