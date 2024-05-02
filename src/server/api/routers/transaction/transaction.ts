import { transactionSchema } from "~/lib/validators/transaction";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { canManageAccounts } from "~/actions/checkUserRole";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { endOfDay, format, startOfDay } from "date-fns";
import { getDateRange } from "~/lib/utils";
import { type $Enums } from "@prisma/client";
import { utapi } from "~/server/storage";

export const commonTransactionInput = z.object({
  societyId: z.string().cuid(),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

// Function to get all unique types from transactions
function getAllTypes(
  transactions: {
    date: string;
    type: $Enums.TransactionType;
    amount: number;
  }[],
): string[] {
  const typesSet = new Set<string>();
  for (const transaction of transactions) {
    typesSet.add(transaction.type);
  }
  return Array.from(typesSet);
}

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      transactionSchema.and(
        z.object({
          societyId: z.string().cuid(),
        }),
      ),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input,
      }) => {
        const canManage = await canManageAccounts(input.societyId);
        if (!canManage) throw new TRPCError({ code: "FORBIDDEN" });

        const transaction = await db.transaction.create({
          data: {
            ...input,
            userId: user.id,
          },
        });

        return transaction;
      },
    ),
  getPieChart: protectedProcedure
    .input(commonTransactionInput)
    .query(async ({ ctx: { db }, input: { societyId, from, to } }) => {
      const pieData = await db.transaction.groupBy({
        where: {
          societyId,
          date: {
            lte: endOfDay(to),
            gte: startOfDay(from),
          },
        },
        by: ["type"],
        _sum: { amount: true },
      });

      return pieData.map((_data) => ({
        label: _data.type,
        data: _data._sum.amount,
      }));
    }),
  getLineChartData: protectedProcedure
    .input(commonTransactionInput)
    .query(async ({ ctx: { db }, input: { from, societyId, to } }) => {
      const data = await db.transaction.findMany({
        where: {
          societyId,
          date: {
            lte: endOfDay(to),
            gte: startOfDay(from),
          },
        },
        select: {
          amount: true,
          type: true,
          date: true,
        },
      });

      const formattedData = data.map((_data) => ({
        ..._data,
        date: format(_data.date, "dd/MM/yyyy"),
      }));

      const dateRange = getDateRange(from, to).map((_date) =>
        format(_date, "dd/MM/yyyy"),
      );

      const dateSumArray: { date: string; type: string; sum: number }[] = [];

      for (const date of dateRange) {
        const typeSumsMap: Record<string, number> = {};

        for (const transaction of formattedData) {
          if (transaction.date === date) {
            const key = transaction.type;
            typeSumsMap[key] = (typeSumsMap[key] ?? 0) + transaction.amount;
          }
        }

        for (const type of Object.keys(typeSumsMap)) {
          dateSumArray.push({ date: date, type, sum: typeSumsMap[type] ?? 0 });
        }
        for (const type of getAllTypes(formattedData)) {
          if (!typeSumsMap[type]) {
            dateSumArray.push({ date: date, type, sum: 0 });
          }
        }
      }

      return dateSumArray;
    }),
  getTableData: protectedProcedure
    .input(commonTransactionInput)
    .query(async ({ ctx: { db }, input: { from, societyId, to } }) => {
      const data = await db.transaction.findMany({
        where: {
          societyId,
          date: {
            lte: endOfDay(to),
            gte: startOfDay(from),
          },
        },
        select: {
          amount: true,
          type: true,
          date: true,
          id: true,
          description: true,
        },
        orderBy: {
          date: "asc",
        },
      });

      return data.map((_data) => ({
        ..._data,
        date: _data.date,
        description: _data.description
          ? _data.description.length > 20
            ? _data.description.slice(0, 19) + " ..."
            : _data.description
          : "Not Provided",
      }));
    }),
  delete: protectedProcedure
    .input(
      z.object({
        societyId: z.string().cuid(),
        transactionID: z.array(z.string().cuid()),
      }),
    )
    .mutation(async ({ ctx: { db }, input: { societyId, transactionID } }) => {
      const canManage = await canManageAccounts(societyId);
      if (!canManage) throw new TRPCError({ code: "FORBIDDEN" });

      const medias = await db.transactionDocs.findMany({
        where: {
          transactionId: {
            in: transactionID,
          },
        },
        select: {
          uri: true,
        },
      });

      const fileKeys = medias.map((_media) => _media.uri.split("/f/")[1]!);

      await utapi.deleteFiles(fileKeys);

      await db.transactionDocs.deleteMany({
        where: {
          transactionId: {
            in: transactionID,
          },
        },
      });

      const rowsDeleted = await db.transaction.deleteMany({
        where: {
          societyId: societyId,
          id: {
            in: transactionID,
          },
        },
      });

      return rowsDeleted.count;
    }),
  update: protectedProcedure
    .input(
      transactionSchema.and(
        z.object({
          societyId: z.string().cuid(),
          transactionId: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const canManage = await canManageAccounts(input.societyId);
      if (!canManage) throw new TRPCError({ code: "FORBIDDEN" });

      const updatedTransaction = await db.transaction.update({
        where: {
          id: input.transactionId,
          societyId: input.societyId,
        },
        data: {
          amount: input.amount,
          date: input.date,
          description: input.description,
          type: input.type,
        },
      });

      return updatedTransaction;
    }),
});
