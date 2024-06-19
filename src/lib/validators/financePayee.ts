import { PAYEE_TYPE } from "@prisma/client";
import { z } from "zod";

export const financePayeeSchema = z.object({
  name: z.string().min(1, "Required").max(250, "Max 250 characters"),
  type: z
    .enum([
      PAYEE_TYPE.BUSINESS,
      PAYEE_TYPE.CONTRACTOR,
      PAYEE_TYPE.EMPLOYEE,
      PAYEE_TYPE.FAMILY,
      PAYEE_TYPE.FINANCIAL_INSTITUTION,
      PAYEE_TYPE.GOVERNMENT,
      PAYEE_TYPE.INDIVIDUAL,
      PAYEE_TYPE.NONPROFIT,
      PAYEE_TYPE.UTILITY,
      PAYEE_TYPE.VENDOR,
    ])
    .default(PAYEE_TYPE.INDIVIDUAL)
    .optional(),

  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Invalid Mobile number")
    .optional(),
  email: z.string().email().optional(),
  identity: z
    .string()
    .regex(/^\d{4}\s\d{4}\s\d{4}$/, "Invalid Aadhar Card Number")
    .or(
      z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid Pan Card Number"),
    )
    .optional(),
  address: z.string().optional(),
  notes: z.string().max(250, "Max 250 characters").optional(),
});
