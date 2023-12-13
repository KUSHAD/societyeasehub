import { newSocietyValidationSchema } from "~/lib/validators/newSociety";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import bcrypt from "bcrypt";

export const societyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newSocietyValidationSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const passwordHash = await bcrypt.hash(input.password, 12);

      const newSociety = await db.society.create({
        data: {
          ...input,
          password: passwordHash,
          ownerEmail: session.user.email!,
          members: {
            create: {
              userEmail: session.user.email!,
            },
          },
        },
      });

      return newSociety;
    }),
});
