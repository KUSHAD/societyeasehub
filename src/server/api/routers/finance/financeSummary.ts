import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { differenceInDays, parse, subDays } from "date-fns";
import {
  fetchFinancialData,
  getActiveDaysFinancialReport,
  getCategoryReport,
  getPayeesReport,
} from "~/actions/fetchFinancialData";
import { calculatePercentageChange, fillMissingDays } from "~/lib/utils";

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
    .query(async ({ input }) => {
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

      const payees = await getPayeesReport(
        input.societyId,
        input.accountId,
        startDate,
        endDate,
      );

      const categories = await getCategoryReport(
        input.societyId,
        input.accountId,
        startDate,
        endDate,
      );

      const activeDays = await getActiveDaysFinancialReport(
        input.societyId,
        input.accountId,
        startDate,
        endDate,
      );

      const days = fillMissingDays(activeDays, startDate, endDate);

      console.log({
        activeDays,
        payees,
        categories,
        currentPeriod,
        lastPeriod,
      });

      return {
        currentPeriod,
        lastPeriod,
        incomeChange,
        expenseChange,
        remainingChange,
        days,
        payees,
        categories,
      };
    }),
});
