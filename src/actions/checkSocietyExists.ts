import { db } from "~/server/db";
import { getCurrentUser } from "./getCurrentUser";
import { redirect } from "next/navigation";

export async function checkSocietyExists(id: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/api/auth/signin");
  const dbSociety = await db.member.findFirst({
    where: {
      societyId: id,
      userId: currentUser.id,
    },
  });

  if (!dbSociety) return false;

  return true;
}
