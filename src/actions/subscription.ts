"use server";

import { db } from "~/server/db";
import { getCurrentUser } from "./getCurrentUser";
import { DAY_IN_MS, absoluteUrl } from "~/lib/utils";
import { stripe } from "~/lib/stripe";
import { env } from "~/env";
import { addDays } from "date-fns";

const returnURL = absoluteUrl(`/subscription`);

export async function getUserSubscription() {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  if (env.NODE_ENV === "development")
    return {
      isActive: true,
      stripeCustomerId: `cus_${currentUser.id}`,
      stripeCurrentPeriodEnd: addDays(Date.now(), 30),
    };

  const data = await db.userSubscription.findFirst({
    where: {
      userId: currentUser.id,
    },
  });

  if (!data) return null;

  const isActive =
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();

  return {
    ...data,
    isActive: !!isActive,
  };
}

export async function createStripeURL() {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Unauthorized");

  const subscription = await getUserSubscription();

  if (subscription?.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnURL,
    });

    return { data: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: currentUser.email!,
    billing_address_collection: "required",
    saved_payment_method_options: {
      payment_method_save: "enabled",
    },
    line_items: [
      {
        quantity: 1,
        price: env.STRIPE_PRICE_ID,
      },
    ],
    metadata: {
      userId: currentUser.id,
    },
    success_url: returnURL,
    cancel_url: returnURL,
  });

  return { data: stripeSession.url };
}
