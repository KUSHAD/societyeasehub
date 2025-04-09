import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { processStripeEvent } from "~/actions/subscription";
import { env } from "~/env";
import { stripe } from "~/lib/stripe";
import { tryCatch } from "~/lib/utils";
import { waitUntil, geolocation } from "@vercel/functions";
import { redis } from "~/server/redis";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  if (!signature) return NextResponse.json({}, { status: 400 });

  async function doEventProcessing() {
    if (typeof signature !== "string") {
      throw new Error("[STRIPE HOOK] Header isn't a string???");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    const locationDetails = geolocation(req);

    console.log("[STRIPE HOOK] Event received", {
      event: event.type,
      location: locationDetails,
    });

    await redis.lpush(
      `stripe:event:logs:${event.type}`,
      JSON.stringify({
        type: event.type,
        receivedAt: new Date().toISOString(),
        location: locationDetails,
        data: event.data,
        eventId: event.id,
      }),
    );

    waitUntil(processStripeEvent(event));
  }

  const { error } = await tryCatch(doEventProcessing());

  if (error) {
    console.error("[STRIPE HOOK] Error processing event", error);
  }

  return NextResponse.json({ received: true });
}
