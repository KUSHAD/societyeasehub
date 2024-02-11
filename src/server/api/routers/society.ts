import { newSocietyValidationSchema } from "~/lib/validators/newSociety";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { z } from "zod";
import { editSocietyValidationSchema } from "~/lib/validators/editSociety";
import { TRPCError } from "@trpc/server";
import { canAccessSettings, isSocietyOwner } from "~/actions/checkUserRole";
import { changePasswordServerSchema } from "~/lib/validators/changePassword";
import { checkIsSocietyMember } from "~/actions/checkIsSocietyMember";
import { deleteSocietySchema } from "~/lib/validators/deleteSociety";

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
      const canAccess = await canAccessSettings(input.id);

      if (!canAccess) throw new TRPCError({ code: "FORBIDDEN" });

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
  changePassword: protectedProcedure.input(changePasswordServerSchema).mutation(
    async ({
      input: { currentPassword, newPassword, societyId },
      ctx: {
        db,
        session: { user },
      },
    }) => {
      const isOwner = await isSocietyOwner(societyId, user.id);

      if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

      const dbSociety = await db.society.findUnique({
        where: {
          id: societyId,
        },
        select: {
          id: true,
          password: true,
        },
      });

      if (!dbSociety) throw new TRPCError({ code: "NOT_FOUND" });

      const passMatch = await bcrypt.compare(
        currentPassword,
        dbSociety.password,
      );

      if (!passMatch)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect Password",
        });

      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      const updatedSociety = await db.society.update({
        where: {
          id: societyId,
        },
        data: {
          password: newPasswordHash,
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

      return updatedSociety;
    },
  ),
  transferOwnership: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        userId: z.string().cuid(),
        password: z
          .string()
          .min(6, "Mininum 6 characters for password")
          .max(16, "Max 16 characers for password"),
      }),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input: { password, societyId, userId },
      }) => {
        const isOwner = await isSocietyOwner(societyId, user.id);

        if (!isOwner) throw new TRPCError({ code: "FORBIDDEN" });

        const dbSociety = await db.society.findUnique({
          where: {
            id: societyId,
          },
          select: {
            id: true,
            password: true,
            ownerId: true,
          },
        });

        if (!dbSociety) throw new TRPCError({ code: "NOT_FOUND" });

        const passMatch = await bcrypt.compare(password, dbSociety.password);

        if (!passMatch)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Incorrect Password",
          });

        if (user.id === userId || dbSociety.ownerId === userId)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You can't transfer society  to yourself",
          });

        const isMember = await checkIsSocietyMember(
          societyId,
          dbSociety.ownerId,
        );

        if (!isMember)
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You are transferring this society  to someone who  is  not a member",
          });

        const updatedSociety = await db.society.update({
          where: {
            id: societyId,
          },
          data: {
            ownerId: userId,
          },
        });

        return updatedSociety;
      },
    ),
  delete: protectedProcedure
    .input(
      deleteSocietySchema.merge(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(
      async ({ ctx: { db, session }, input: { password, societyId } }) => {
        const isOwner = await isSocietyOwner(societyId, session.user.id);

        if (!isOwner) throw new TRPCError({ code: "UNAUTHORIZED" });

        const dbSociety = await db.society.findUnique({
          where: {
            id: societyId,
          },
          select: {
            id: true,
            password: true,
            ownerId: true,
          },
        });

        if (!dbSociety) throw new TRPCError({ code: "NOT_FOUND" });

        const passMatch = await bcrypt.compare(password, dbSociety.password);

        if (!passMatch)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Incorrect Password",
          });

        throw new TRPCError({ code: "NOT_IMPLEMENTED" });
      },
    ),
});
