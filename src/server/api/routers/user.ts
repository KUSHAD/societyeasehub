import { getCurrentUser } from "~/actions/getCurrentUser";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getUserSubscriptionPlan } from "~/actions/getUserSubscription";
import { env } from "~/env";
import { stripe } from "~/lib/stripe";
import { absoluteUrl } from "~/lib/utils";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const userRouter = createTRPCRouter({
  createStripeSession: publicProcedure.mutation(async ({ ctx: { db } }) => {
    const currentUser = await getCurrentUser();
    const billingUrl = absoluteUrl("/subscription");

    if (!currentUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        email: currentUser.email,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: dbUser.email!,
      line_items: [
        {
          price: env.STRIPE_PRICE_CONFIG,
          quantity: 1,
        },
      ],
      metadata: {
        userId: currentUser.id,
      },
      client_reference_id: currentUser.id,
    });

    return { url: stripeSession.url };
  }),
  createBillingPortal: publicProcedure.mutation(async ({ ctx: { db } }) => {
    const currentUser = await getCurrentUser();

    const billingUrl = absoluteUrl("/subscription");

    if (!currentUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        email: currentUser.email,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (!subscriptionPlan.isSubscribed || !dbUser.stripeCustomerId)
      throw new TRPCError({
        code: "FORBIDDEN",
      });

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: billingUrl,
    });

    return { url: stripeSession.url };
  }),
  updateName: protectedProcedure
    .input(
      z.object({
        name: z
          .string({
            required_error: "Name is required",
          })
          .max(25, "Maximum 25 Characters")
          .min(1, "Required"),
      }),
    )
    .mutation(async ({ ctx: { db, session }, input: { name } }) => {
      const updatedName = await db.user.update({
        where: {
          email: session.user.email!,
        },
        data: {
          name: name,
        },
        select: {
          name: true,
        },
      });
      revalidatePath("/profile", "page");
      return { updatedName: updatedName.name! };
    }),
});
