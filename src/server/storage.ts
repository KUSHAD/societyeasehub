import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { getUserSubscriptionPlan } from "~/actions/getUserSubscription";
import { db } from "./db";
import { z } from "zod";

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
        throw new Error("Unauthorized");

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
        societyId: z.string({
          required_error: "Society ID Required",
        }),
      }),
    )
    .middleware(async ({ input: { societyId } }) => {
      const currentUser = await getCurrentUser();

      const subscription = await getUserSubscriptionPlan();

      if (!currentUser || !subscription.isSubscribed)
        throw new Error("Unauthorized");

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

      if (!dbSociety) throw new Error("No Society Found");

      if (dbSociety._count.images >= 5) throw new Error("Max Images Uploaded ");

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
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
