import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi, UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { db } from "./db";
import { z } from "zod";
import {
  canAccessSettings,
  canAnnounce,
  canSendMessages,
} from "~/actions/checkUserRole";
import { getUserSubscription } from "~/actions/subscription";
import { pusher } from "./pusher";

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
  profileImage: f({
    image: { maxFileSize: "1MB", maxFileCount: 1, minFileCount: 1 },
  })
    .middleware(async () => {
      const currentUser = await getCurrentUser();

      const subscription = await getUserSubscription();

      if (!currentUser || !subscription || !subscription.isActive)
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

      await pusher.trigger("private-subs", "mutation-event",{message:"Profile image updated"});

      return {
        profileURL: updatedUserImage.image!,
        userId: metadata.userId,
      };
    }),
  societyMedia: f({
    image: { maxFileCount: 5, maxFileSize: "4MB", minFileCount: 1 },
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

      const subscription = await getUserSubscription();

      const canAccess = await canAccessSettings(societyId);

      if (!currentUser || !canAccess || !subscription || !subscription.isActive)
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

      await pusher.trigger("private-subs", "mutation-event",{message:"Society Media Uploaded""});

      
      return { id: newMedia.id, uri: newMedia.uri };
    }),
  messageAttachments: f({
    image: { maxFileCount: 5, maxFileSize: "4MB", minFileCount: 1 },
    video: { maxFileCount: 5, maxFileSize: "16MB", minFileCount: 1 },
  })
    .input(
      z.object({
        societyId: z.string().cuid(),
        currentFileCount: z.number(),
      }),
    )
    .middleware(async ({ files, input: { societyId, currentFileCount } }) => {
      if (currentFileCount === 5)
        throw new UploadThingError("Max 5 attachments");

      if (files.length > 5) throw new UploadThingError("Max 5 attachments");

      if (currentFileCount + files.length > 5)
        throw new UploadThingError("Max 5 attachments");

      const currentUser = await getCurrentUser();
      const subscription = await getUserSubscription();

      const canAccess = await canSendMessages(societyId);

      if (!currentUser || !canAccess || !subscription || !subscription.isActive)
        throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(({ file }) => {

      
      
      return file;
    }),
  announcementAttachments: f({
    image: { maxFileCount: 5, maxFileSize: "4MB", minFileCount: 1 },
    video: { maxFileCount: 5, maxFileSize: "16MB", minFileCount: 1 },
    pdf: { maxFileCount: 5, maxFileSize: "4MB", minFileCount: 1 },
  })
    .input(
      z.object({
        societyId: z.string().cuid(),
        currentFileCount: z.number(),
      }),
    )
    .middleware(async ({ files, input: { societyId, currentFileCount } }) => {
      if (currentFileCount === 5)
        throw new UploadThingError("Max 5 attachments");

      if (files.length > 5) throw new UploadThingError("Max 5 attachments");

      if (currentFileCount + files.length > 5)
        throw new UploadThingError("Max 5 attachments");
      const currentUser = await getCurrentUser();

      const subscription = await getUserSubscription();

      const canAccess = await canAnnounce(societyId);

      if (!currentUser || !canAccess || !subscription || !subscription.isActive)
        throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(({ file }) => {
      return file;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
