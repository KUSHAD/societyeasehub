import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { env } from "~/env";
import { stripe } from "~/lib/stripe";
import { db } from "~/server/db";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHHOK_SECRET,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return new NextResponse(`Webhook Error:- ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed":
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      if (!session?.metadata?.userId)
        return new NextResponse("User Id is required", { status: 400 });

      await db.userSubscription.create({
        data: {
          userId: session.metadata.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0]!.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
      break;

    case "invoice.payment_succeeded":
      const _subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      await db.userSubscription.updateMany({
        where: {
          stripeSubscriptionId: _subscription.id,
        },
        data: {
          stripePriceId: _subscription.items.data[0]!.price.id,
          stripeCurrentPeriodEnd: new Date(
            _subscription.current_period_end * 1000,
          ),
        },
      });
      break;

    case "customer.subscription.resumed":
      const resumedSubscription = event.data.object;

      await db.userSubscription.updateMany({
        where: {
          stripeSubscriptionId: resumedSubscription.id,
        },
        data: {
          stripePriceId: resumedSubscription.items.data[0]!.price.id,
          stripeCurrentPeriodEnd: new Date(
            resumedSubscription.current_period_end * 1000,
          ),
        },
      });

    default:
      break;
  }

  return new NextResponse(null, {
    status: 200,
  });
}
