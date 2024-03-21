import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "~/actions/getCurrentUser";

export const safeAction = createSafeActionClient({
  middleware: async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("Unauthorized");

    return {
      currentUserId: currentUser.id,
    };
  },
});
