import { db } from "~/server/db";

export async function checkSocietyExists(id: string) {
  const dbSociety = await db.society.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!dbSociety) return false;

  return true;
}
