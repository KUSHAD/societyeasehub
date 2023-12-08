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
      email: true,
      id: true,
      name: true,
      image: true,
    },
  });

  if (!currentUser) {
    return null;
  }

  return currentUser;
}
