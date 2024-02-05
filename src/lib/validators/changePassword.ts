import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Mininum 6 characters for password")
      .max(16, "Max 16 characers for password"),
    newPassword: z
      .string()
      .min(6, "Mininum 6 characters for password")
      .max(16, "Max 16 characers for password"),
    confirmNewPassword: z
      .string()
      .min(6, "Mininum 6 characters for password")
      .max(16, "Max 16 characers for password"),
  })
  .superRefine(({ confirmNewPassword, newPassword, currentPassword }, ctx) => {
    if (currentPassword === newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Can't be same as current password",
        path: ["newPassword"],
      });
    }
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmNewPassword"],
      });
    }
  });

export const changePasswordServerSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Mininum 6 characters for password")
      .max(16, "Max 16 characers for password"),
    newPassword: z
      .string()
      .min(6, "Mininum 6 characters for password")
      .max(16, "Max 16 characers for password"),
    confirmNewPassword: z
      .string()
      .min(6, "Mininum 6 characters for password")
      .max(16, "Max 16 characers for password"),
    societyId: z.string().cuid(),
  })
  .superRefine(({ confirmNewPassword, newPassword, currentPassword }, ctx) => {
    if (currentPassword === newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Can't be same as current password",
        path: ["newPassword"],
      });
    }
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmNewPassword"],
      });
    }
  });
