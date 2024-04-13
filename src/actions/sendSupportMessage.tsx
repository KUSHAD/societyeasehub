"use client";

import { resend } from "~/lib/resend";
import { publicSafeAction } from "~/lib/safe-action";
import { supportSchema } from "~/lib/validators/support";

export const sendSupportMessage = publicSafeAction(
  supportSchema,
  async ({ email, message }) => {
    const { data, error } = await resend.emails.send({
      from: "SocietyEaseHub Support <onboarding@resend.dev>",
      to: [email, "kushad.chakraborty@gmail.com"],
      reply_to: ["kushad.chakraborty@gmail.com"],
      subject: "Society Easehub Support",
      html: `
    <p>${message}</p>
    <br />
    <p>For further Contact pls reply to this email</p>
    `,
    });

    if (data) {
      return {
        success: "Thanks for contacting we will reach out to you ASAP",
      };
    }

    if (error) {
      return {
        failure: error.message,
      };
    }
  },
);
