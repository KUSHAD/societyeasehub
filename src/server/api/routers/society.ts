import { newSocietyValidationSchema } from "~/lib/validators/newSociety";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { z } from "zod";
import { notFound } from "next/navigation";

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
  getUserMemberships: protectedProcedure.query(
    async ({ ctx: { db, session } }) => {
      const societies = await db.society.findMany({
        where: {
          members: {
            every: {
              userEmail: session.user.email!,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          ownerEmail: true,
          owner: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
      });
      return societies;
    },
  ),
  getSocietyName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { db }, input: { id } }) => {
      const dbSociety = await db.society.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
        },
      });

      if (!dbSociety) {
        notFound();
      }

      return dbSociety.name;
    }),
});
