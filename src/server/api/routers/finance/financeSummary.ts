import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { differenceInDays, parse, subDays } from "date-fns";
import { fetchFinancialData } from "~/actions/fetchFinancialData";
import { calculatePercentageChange, fillMissingDays } from "~/lib/utils";

type RawGroupData = {
  name: string;
  value: number;
};

export type ActiveDaysData = {
  date: Date;
  income: string;
  expense: string;
};

export const financeSummaryRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z
        .object({
          societyId: z.string().cuid(),
          from: z.string().optional(),
          to: z.string().optional(),
          accountId: z.string().cuid(),
        })
        .or(
          z.object({
            societyId: z.string().cuid(),
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string(),
          }),
        ),
    )
    .query(async ({ ctx: { db }, input }) => {
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = input.from
        ? parse(input.from, "yyyy-MM-dd", new Date())
        : defaultFrom;

      const endDate = input.to
        ? parse(input.to, "yyyy-MM-dd", new Date())
        : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;

      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      const currentPeriod = await fetchFinancialData(
        input.societyId,
        input.accountId,
        startDate,
        endDate,
      );

      const lastPeriod = await fetchFinancialData(
        input.societyId,
        input.accountId,
        lastPeriodStart,
        lastPeriodEnd,
      );

      const incomeChange = calculatePercentageChange(
        currentPeriod.income,
        lastPeriod.income,
      );

      const expenseChange = calculatePercentageChange(
        currentPeriod.expense,
        lastPeriod.expense,
      );

      const remainingChange = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining,
      );

      const category = await db.$queryRaw<RawGroupData[]>`
      SELECT
        c.name AS name,
        SUM(ABS(t.amount)) AS value
      FROM
        "FinanceTransaction" t
      INNER JOIN
        "FinanceAccount" a ON t."accountId" = a.id
      INNER JOIN
        "FinanceCategory" c ON t."categoryId" = c.id
      WHERE
        t.societyId = ${input.societyId}
        ${input.accountId.length !== 0 ? `AND t."accountId" = ${input.accountId}` : ""}
        AND t.amount < 0
        AND t.date >= ${startDate}
        AND t.date <= ${endDate}
      GROUP BY
        c.name
      ORDER BY 
        SUM(ABS(t.amount)) DESC; 
      `;

      const payee = await db.$queryRaw<RawGroupData[]>`
      SELECT
        p.name AS name,
        SUM(ABS(t.amount)) AS value
      FROM
        "FinanceTransaction" t
      INNER JOIN
        "FinanceAccount" a ON t."accountId" = a.id
      INNER JOIN
        "FinancePayee" p ON t."categoryId" = p.id
      WHERE
        t.societyId = ${input.societyId}
        ${input.accountId.length !== 0 ? `AND t."accountId" = ${input.accountId}` : ""}
        AND t.amount < 0
        AND t.date >= ${startDate}
        AND t.date <= ${endDate}
      GROUP BY
        p.name
      ORDER BY 
        SUM(ABS(t.amount)) DESC; 
      `;

      const topCategories = category.splice(0, 3);
      const otherCategories = category.splice(3);

      const otherCategorySum = otherCategories.reduce(
        (sum, current) => sum + current.value,
        0,
      );

      const finalCategories = topCategories;
      if (otherCategories.length > 0) {
        finalCategories.push({
          name: "Other",
          value: otherCategorySum,
        });
      }

      const topPayees = payee.splice(0, 3);
      const otherPayees = payee.splice(3);

      const otherPayeeSum = otherPayees.reduce(
        (sum, current) => sum + current.value,
        0,
      );

      const finalPayees = topPayees;
      if (otherPayees.length > 0) {
        finalCategories.push({
          name: "Other",
          value: otherPayeeSum,
        });
      }

      const activeDays = (await db.$executeRaw<ActiveDaysData[]>`
      SELECT
        t.date as date,
        SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END) AS income,
        SUM(CASE WHEN t.amount < 0 THEN t.amount ELSE 0 END) AS expense,
      FROM
        "FinanceTransaction" t
      INNER JOIN
        "FinanceAccount" a ON t."accountId" = a.id
      WHERE
        t.societyId = ${input.societyId}
        ${input.accountId.length !== 0 ? `AND t."accountId" = ${input.accountId}` : ""}
        AND t.date >= ${startDate}
        AND t.date <= ${endDate}
      GROUP BY
        t.date
      ORDER BY
        t.date
      `) as unknown as ActiveDaysData[];

      const days = fillMissingDays(activeDays, startDate, endDate);

      return {
        currentPeriod,
        lastPeriod,
        incomeChange,
        expenseChange,
        remainingChange,
        finalCategories,
        finalPayees,
        days,
      };
    }),
});
