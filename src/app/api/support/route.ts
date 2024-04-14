import { supportSchema } from "~/lib/validators/support";
import { resend } from "~/lib/resend";

export async function POST(req: Request) {
  const body: unknown = await req.json();
  const { email, message, name } = supportSchema.parse(body);

  const { data, error } = await resend.emails.send({
    from: "SocietyEaseHub Support <onboarding@resend.dev>",
    to: [email, "kushad.chakraborty@gmail.com"],
    reply_to: ["kushad.chakraborty@gmail.com", email],
    subject: "Society Easehub Support",
    html: `
     <p>${name} Thanks for contacting support</p>
    <p>${message}</p>
    <br />
    <p>For further Contact pls reply to this email</p>
    `,
  });

  if (data) {
    return Response.json(
      {
        message: "Thanks for contacting we will reach out to you ASAP",
      },
      { status: 200 },
    );
  }

  if (error) {
    return Response.json(
      {
        message: error.message,
      },
      { status: 400 },
    );
  }
}
