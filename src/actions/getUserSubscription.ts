import { redirect } from "next/navigation";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { stripe } from "~/lib/stripe";

export async function getUserSubscriptionPlan() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/api/auth/signin");

  const isSubscribed = Boolean(
    currentUser.stripePriceId &&
      currentUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      currentUser.stripeCurrentPeriodEnd.getTime() + 86400000 > Date.now(),
  );

  let isCanceled = false;
  if (isSubscribed && currentUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      currentUser.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    stripeSubscriptionId: currentUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: currentUser.stripeCurrentPeriodEnd,
    stripeCustomerId: currentUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}
