import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export async function getCurrentUser() {
  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return null;
  }

  const currentUser = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!currentUser) {
    return null;
  }

  return currentUser;
}
