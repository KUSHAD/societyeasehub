import { getCurrentUser } from "~/actions/getCurrentUser";
import { env } from "~/env";
import { createId } from "@paralleldrive/cuid2";
import { addDays } from "date-fns";

export async function getUserSubscriptionPlan() {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  if (env.NODE_ENV !== "production") {
    return {
      stripeSubscriptionId: `su_${createId()}`,
      stripeCurrentPeriodEnd: addDays(new Date(), 30),
      stripeCustomerId: `cu_${createId()}`,
      isSubscribed: true,
    };
  }

  const isSubscribed = Boolean(
    currentUser.stripePriceId &&
      currentUser.stripeCurrentPeriodEnd &&
      currentUser.stripeCurrentPeriodEnd.getTime() > Date.now(),
  );

  return {
    stripeSubscriptionId: currentUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: currentUser.stripeCurrentPeriodEnd,
    stripeCustomerId: currentUser.stripeCustomerId,
    isSubscribed,
  };
}
