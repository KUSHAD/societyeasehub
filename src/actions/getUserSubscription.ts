import { getCurrentUser } from "~/actions/getCurrentUser";

export async function getUserSubscriptionPlan() {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

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
