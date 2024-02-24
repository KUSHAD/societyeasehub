import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { getUserSubscriptionPlan } from "~/actions/getUserSubscription";

export const safeAction = createSafeActionClient({
  middleware: async () => {
    const currentUser = await getCurrentUser();

    const subscription = await getUserSubscriptionPlan();

    if (!currentUser || !subscription.isSubscribed)
      throw new Error("Unauthorized");

    return {
      currentUserId: currentUser.id,
    };
  },
});
