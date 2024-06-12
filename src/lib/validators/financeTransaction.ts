import { z } from "zod";

export const financeTransactionSchema = z.object({
  amount: z.coerce.number(),
  payee: z.string().min(3, "Invalid Payee Name").max(250, "Max 250 Characters"),
  accountId: z.string().cuid().describe("Account"),
  categoryId: z.string().cuid().describe("Category").optional(),
  date: z.coerce.date().default(new Date()).describe("Transaction Date"),
  notes: z
    .string()
    .min(3, "Invalid Note")
    .max(250, "Max 250 Characters")
    .optional(),
});
