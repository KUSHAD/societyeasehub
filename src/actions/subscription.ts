"use server";

import { db } from "~/server/db";
import { getCurrentUser } from "./getCurrentUser";
import { absoluteUrl } from "~/lib/utils";
import { stripe, stripeAllowedEvents } from "~/lib/stripe";
import { env } from "~/env";
import { addDays, getUnixTime } from "date-fns";
import type Stripe from "stripe";

const returnURL = absoluteUrl(`/subscription`);

export async function getUserSubscription() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  if (env.NODE_ENV === "development") {
    return {
      isActive: true,
      stripeCustomerId: `cus_${currentUser.id}`,
      stripeCurrentPeriodEnd: getUnixTime(addDays(new Date(), 30)),
      stripeStatus: "active",
    };
  }

  const subscription = await db.userSubscription.findFirst({
    where: { userId: currentUser.id },
  });

  if (!subscription) return null;

  const isActive =
    subscription.stripeStatus === "active" &&
    (subscription.stripeCurrentPeriodEnd ?? 0) * 1000 > Date.now();

  return {
    ...subscription,
    isActive,
  };
}

export async function createStripeURL() {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  let subscription = await db.userSubscription.findFirst({
    where: { userId: currentUser.id },
  });

  let stripeCustomerId = subscription?.stripeCustomerId;

  // If no stripeCustomerId, create one and store it
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: currentUser.email!,
      metadata: {
        userId: currentUser.id,
      },
    });

    stripeCustomerId = customer.id;

    if (subscription) {
      await db.userSubscription.update({
        where: { id: subscription.id },
        data: {
          stripeCustomerId,
        },
      });
    } else {
      subscription = await db.userSubscription.create({
        data: {
          userId: currentUser.id,
          stripeCustomerId,
          stripeStatus: "none", // default fallback
        },
      });
    }
  }

  const isSubscribed =
    subscription?.stripeStatus === "active" &&
    (subscription.stripeCurrentPeriodEnd ?? 0) * 1000 > Date.now();

  // If active, send to billing portal
  if (isSubscribed) {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnURL,
    });

    return { data: portalSession.url };
  }

  // Else, send to checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    billing_address_collection: "required",
    customer_email: currentUser.email!,
    line_items: [
      {
        price: env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    metadata: {
      userId: currentUser.id,
    },
    success_url: returnURL,
    cancel_url: returnURL,
  });

  return { data: checkoutSession.url };
}

export async function syncStripeDataToDB(stripeCustomerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 1,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    if (subscriptions.data.length === 0) {
      // If subscription is cancelled or doesn't exist, update status to 'none'
      await db.userSubscription.updateMany({
        where: { stripeCustomerId },
        data: {
          stripeStatus: "none",
        },
      });

      return { status: "none" };
    }

    const subscription = subscriptions.data[0]!;

    const paymentMethod =
      subscription.default_payment_method &&
      typeof subscription.default_payment_method !== "string"
        ? subscription.default_payment_method
        : null;

    const brand = paymentMethod?.card?.brand ?? null;
    const last4 = paymentMethod?.card?.last4 ?? null;

    await db.userSubscription.updateMany({
      where: { stripeCustomerId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeStatus: subscription.status,
        stripePriceId: subscription.items.data[0]!.price.id,
        stripeCurrentPeriodStart: subscription.current_period_start,
        stripeCurrentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        paymentBrand: brand,
        paymentLast4: last4,
      },
    });

    return {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]!.price.id,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      paymentBrand: brand,
      paymentLast4: last4,
    };
  } catch (error) {
    console.error("Failed to sync Stripe subscription to DB", error);
    throw error;
  }
}

export async function processStripeEvent(event: Stripe.Event) {
  // Skip processing if the event isn't one I'm tracking (list of all events below)
  if (!stripeAllowedEvents.includes(event.type)) return;

  // All the events I track have a customerId
  const { customer: customerId } = event?.data?.object as {
    customer: string; // Sadly TypeScript does not know this
  };

  // This helps make it typesafe and also lets me know if my assumption is wrong
  if (typeof customerId !== "string") {
    throw new Error(
      `[STRIPE HOOK][CANCER] ID isn't string.\nEvent type: ${event.type}`,
    );
  }

  return await syncStripeDataToDB(customerId);
}
