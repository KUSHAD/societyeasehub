import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.coerce.number().min(1),
  type: z
    .enum(["INCOME", "EXPENDITURE", "DUES", "PAYMENT"])
    .describe("Transaction Type")
    .default("INCOME"),
  description: z
    .string()
    .min(10, "Min 10 chars")
    .max(200, "Max 200 chars")
    .optional(),
  date: z.coerce.date().default(new Date()).describe("Transaction Date"),
});
