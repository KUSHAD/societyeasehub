import { z } from "zod";

export const newRole = z.object({
  name: z
    .string({
      required_error: "Required",
    })
    .min(1, "Required")
    .max(25, "Max 25 Characters"),
  accessSettings: z.boolean().optional().default(false),
  createInvite: z.boolean().optional().default(false),
  assignRole: z.boolean().optional().default(false),
  kickUser: z.boolean().optional().default(false),
  manageChannel: z.boolean().optional().default(false),
  sendMessage: z.boolean().optional().default(false),
  createMeeting: z.boolean().optional().default(false),
  manageRoadmap: z.boolean().optional().default(false),
  manageAccounts: z.boolean().optional().default(false),
  canAnnounce: z.boolean().optional().default(false),
  canComment: z.boolean().optional().default(false),
  canCreatePolls: z.boolean().optional().default(false),
  canVote: z.boolean().optional().default(false),
});
