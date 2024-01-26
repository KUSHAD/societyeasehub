import { newSocietyValidationSchema } from "~/lib/validators/newSociety";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { z } from "zod";
import { editSocietyValidationSchema } from "~/lib/validators/editSociety";
import { TRPCError } from "@trpc/server";

export const societyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newSocietyValidationSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const passwordHash = await bcrypt.hash(input.password, 12);

      const newSociety = await db.society.create({
        data: {
          ...input,
          password: passwordHash,
          ownerId: session.user.id,
          members: {
            create: {
              userId: session.user.id,
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
            some: {
              userId: session.user.id,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          ownerId: true,
          owner: {
            select: {
              name: true,
              email: true,
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
  getName: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
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

      if (!dbSociety) throw new TRPCError({ code: "NOT_FOUND" });

      return dbSociety.name;
    }),
  getInfo: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ ctx: { db }, input: { id } }) => {
      const dbSociety = await db.society.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
          streetAddress: true,
          addressLine2: true,
          city: true,
          province: true,
          zipCode: true,
          country: true,
        },
      });

      if (!dbSociety) return null;

      return { ...dbSociety };
    }),
  update: protectedProcedure
    .input(
      editSocietyValidationSchema.extend({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const dbSociety = await db.society.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!dbSociety) throw new TRPCError({ code: "NOT_FOUND" });

      const updatedValue = await db.society.update({
        where: {
          id: input.id,
        },
        data: input,
      });

      return updatedValue;
    }),
});
