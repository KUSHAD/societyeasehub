import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { getUserSubscriptionPlan } from "~/actions/getUserSubscription";
import { db } from "./db";

const f = createUploadthing();
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
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
