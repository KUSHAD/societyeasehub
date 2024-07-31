import { z } from "zod";

export const integrationSchema = z.object({
  integrateTransactions: z.boolean().default(false),
  integrateAnnouncements: z.boolean().default(false),
  integrateRoadmaps: z.boolean().default(false),
});
