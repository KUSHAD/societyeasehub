import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi, UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { getUserSubscriptionPlan } from "~/actions/getUserSubscription";
import { db } from "./db";
import { z } from "zod";
import { canAccessSettings, canSendMessages } from "~/actions/checkUserRole";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("error", err);
    console.log("cause", err.cause);
    return {
      message: err.message,
    };
  },
});

export const utapi = new UTApi();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(async () => {
      const currentUser = await getCurrentUser();

      const subscription = await getUserSubscriptionPlan();

      if (!currentUser || !subscription.isSubscribed)
        throw new UploadThingError("Unauthorized");

      return { userId: currentUser.id, prevImage: currentUser.image! };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const updatedUserImage = await db.user.update({
        where: {
          id: metadata.userId,
        },
        data: {
          image: file.url,
        },
        select: {
          image: true,
        },
      });

      if (metadata.prevImage.includes("utfs.io")) {
        const imageKey = metadata.prevImage.split("/f/")[1]!;

        await utapi.deleteFiles(imageKey);
      }
      revalidatePath("/profile", "page");

      return {
        profileURL: updatedUserImage.image!,
        userId: metadata.userId,
      };
    }),
  societyMedia: f({
    image: { maxFileCount: 5, maxFileSize: "4MB" },
  })
    .input(
      z.object({
        societyId: z
          .string({
            required_error: "Society ID Required",
          })
          .cuid(),
      }),
    )
    .middleware(async ({ input: { societyId }, files }) => {
      const currentUser = await getCurrentUser();

      const subscription = await getUserSubscriptionPlan();

      const canAccess = await canAccessSettings(societyId);

      if (!currentUser || !subscription.isSubscribed || !canAccess)
        throw new UploadThingError("Unauthorized");

      const dbSociety = await db.society.findUnique({
        where: {
          id: societyId,
        },
        select: {
          _count: {
            select: {
              images: true,
            },
          },
        },
      });

      if (!dbSociety) throw new UploadThingError("No Society Found");

      if (dbSociety._count.images >= 5)
        throw new UploadThingError("Max Images Uploaded ");

      if (dbSociety._count.images + files.length > 5)
        throw new UploadThingError("Total Society Images can't be more than 5");

      return {
        societyId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newMedia = await db.societyMedia.create({
        data: {
          uri: file.url,
          societyId: metadata.societyId,
        },
        select: {
          id: true,
          uri: true,
        },
      });
      revalidatePath(`/society/${metadata.societyId}/settings/general`, "page");
      return { id: newMedia.id, uri: newMedia.uri };
    }),
  messageAttachments: f({
    image: { maxFileCount: 5, maxFileSize: "4MB" },
    video: { maxFileCount: 5, maxFileSize: "16MB" },
  })
    .input(
      z.object({
        messageId: z.string().cuid().optional(),
        societyId: z.string().cuid(),
      }),
    )
    .middleware(async ({ files, input: { messageId, societyId } }) => {
      if (files.length > 5) throw new UploadThingError("Max 5 attachments");

      const currentUser = await getCurrentUser();

      const subscription = await getUserSubscriptionPlan();

      const canAccess = await canSendMessages(societyId);

      if (!currentUser || !subscription.isSubscribed || !canAccess)
        throw new UploadThingError("Unauthorized");

      if (messageId) {
        const attachments = await db.messageAttachment.findMany({
          where: {
            messageId,
          },
        });

        if (attachments.length >= 5)
          throw new UploadThingError("Max 5 attachments allowed");

        if (attachments.length + files.length > 5)
          throw new UploadThingError(
            "Your  uploaded attachments will  be exceeding 5 atachments  per message",
          );
      }

      return {
        messageId: messageId ?? "",
      };
    })
    .onUploadComplete(({ file }) => {
      return file;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
