import "server-only";
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

  if (dbSociety.ownerId === userId || dbSociety.ownerId === currentUser.id)
    return true;

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

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        createInvite: true,
      },
    },
  });

  if (dbMemberShip) return true;

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

  if (!dbSociety) redirect("/");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        accessSettings: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canAssignRoles(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        assignRole: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canKickMember(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        kickUser: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canManageChannels(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        manageChannel: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canSendMessages(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        sendMessage: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canCreateMeetings(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        createMeeting: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canManageRoadmaps(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        manageRoadmap: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canManageAccounts(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        manageAccounts: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canAnnounce(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        canAnnounce: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canComment(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        canComment: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canCreatePolls(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        canCreatePolls: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}

export async function canVote(societyId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/api/auth/signin");

  const dbSociety = await db.society.findUnique({
    where: {
      id: societyId,
    },
  });

  if (!dbSociety) redirect("/dashboard");

  if (dbSociety.ownerId === currentUser.id) return true;

  const dbMemberShip = await db.member.findFirst({
    where: {
      societyId,
      userId: currentUser.id,
      role: {
        canVote: true,
      },
    },
  });

  if (dbMemberShip) return true;

  return false;
}
