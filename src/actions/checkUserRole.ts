import { redirect } from "next/navigation";
import { getCurrentUser } from "./getCurrentUser";
import { db } from "~/server/db";
export async function isSocietyOwner(societyId: string, userId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (userId && dbSociety.ownerId === userId) return true;

  if (userId === currentUser.id) return true;

  return false;
}

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

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return false;
}

export async function canAccessSettings(societyId: string) {
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
        accessSettings: true,
      },
    },
  });

  if (!dbSociety) redirect("/");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return true;
}

export async function canAssignRoles(societyId: string) {
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
        assignRole: true,
      },
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return true;
}

export async function canKickMember(societyId: string) {
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
        kickUser: true,
      },
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return true;
}

export async function canManageChannels(societyId: string) {
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
        manageChannel: true,
      },
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return true;
}

export async function canSendMessages(societyId: string) {
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
        sendMessage: true,
      },
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return true;
}

export async function canCreateMeetings(societyId: string) {
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
        createMeeting: true,
      },
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return true;
}

export async function canManageRoadmaps(societyId: string) {
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
        manageRoadmap: true,
      },
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  if (!dbMemberShip) return false;

  return true;
}
