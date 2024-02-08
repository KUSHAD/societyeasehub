import { db } from "~/server/db";
import { getCurrentUser } from "./getCurrentUser";
import { redirect } from "next/navigation";

export async function checkIsSocietyMember(societyId: string, userId?: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/api/auth/signin");
  const dbSociety = await db.member.findFirst({
    where: {
      societyId: societyId,
      userId: userId ? userId : currentUser.id,
    },
  });

  if (!dbSociety) return false;

  return true;
}
