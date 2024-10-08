import { z } from "zod";

export const financeTransactionSchema = z.object({
  date: z.coerce.date().describe("Date"),
  accountId: z.string().cuid().describe("Account"),
  categoryId: z.string().cuid().describe("Category").optional(),
  payeeId: z.string().cuid().describe("Payee"),
  amount: z.coerce.number(),
  notes: z
    .string()
    .min(3, "Invalid Note")
    .max(250, "Max 250 Characters")
    .optional(),
});
