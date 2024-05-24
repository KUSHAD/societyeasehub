import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { getUserSubscription } from "~/actions/subscription";

export const safeAction = createSafeActionClient({
  middleware: async () => {
    const currentUser = await getCurrentUser();

    const subscription = await getUserSubscription();

    if (!currentUser || !subscription || !subscription.isActive)
      throw new Error("Unauthorized");

    return {
      currentUserId: currentUser.id,
      subscription,
    };
  },
});

export const publicSafeAction = createSafeActionClient({});
