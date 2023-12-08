import { redirect } from "next/navigation";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { env } from "~/env";
import { stripe } from "~/lib/stripe";

export async function getUserSubscriptionPlan() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/api/auth/signin");

  // Only give fake credentials in dev mode to  bypass webhook
  const nowTime = Date.now() + 86_400_000;

  if (env.NODE_ENV === "development")
    return {
      stripeSubscriptionId: "stripeSubscriptionId",
      stripeCurrentPeriodEnd: nowTime,
      stripeCustomerId: "stripeCustomerId",
      isSubscribed: true,
      isCanceled: false,
    };

  const isSubscribed = Boolean(
    currentUser.stripePriceId &&
      currentUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      currentUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now(),
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
