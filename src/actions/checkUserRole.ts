import { redirect } from "next/navigation";
import { getCurrentUser } from "./getCurrentUser";
import { db } from "~/server/db";

export async function canCreateInvites(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        createInvite: true,
      },
    },
  });

  if (!dbSociety) throw new Error("No Society Found");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return false;
}

export async function canAccessGeneral(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        accessGeneral: true,
      },
    },
  });

  if (!dbSociety) throw new Error("No Society Found");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return false;
}

export async function canAccessRole(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        accessRole: true,
      },
    },
  });

  if (!dbSociety) throw new Error("No Society Found");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return false;
}

export async function canAccessDanger(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        accessDanger: true,
      },
    },
  });

  if (!dbSociety) throw new Error("No Society Found");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return false;
}
