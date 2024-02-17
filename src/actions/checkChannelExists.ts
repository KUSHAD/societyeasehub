import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { checkIsSocietyMember } from "./checkIsSocietyMember";

export async function checkChannelExists(
  channelId: string,
  societyId: string,
  userId?: string,
) {
  const isMember = await checkIsSocietyMember(societyId, userId);
  if (!isMember) redirect("/dashboard");

  const channelExists = await db.channel.findFirst({
    where: {
      id: channelId,
      societyId,
    },
  });

  if (!channelExists) redirect(`/society/${societyId}/feed/announcement`);
  return true;
}
