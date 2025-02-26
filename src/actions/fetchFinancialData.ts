import "server-only";

import { convertAmountFromMiliUnits } from "~/lib/utils";
import { db } from "~/server/db";
import {
  financialReportWithoutAccount,
  financialReportWithAccount,
  activeDaysFinancialReportWithAccount,
  activeDaysFinancialReportWithoutAccount,
  categoryReportWithAccount,
  categoryReportWithoutAccount,
  payeeReportWithAccount,
  payeeReportWithoutAccount,
} from "@prisma/client/sql";

export async function fetchFinancialData(
  societyId: string,
  accountId: string,
  startDate: Date,
  endDate: Date,
) {
  const result = await db.$queryRawTyped(
    accountId
      ? financialReportWithAccount(societyId, startDate, endDate, accountId)
      : financialReportWithoutAccount(societyId, startDate, endDate),
  );

  const { income, expense, remaining } = result[0]!;

  const formattedIncome = Number(income ?? 0);
  const formattedExpense = Number(expense ?? 0);
  const formattedRemaining = Number(remaining ?? 0);

  return {
    income: convertAmountFromMiliUnits(formattedIncome),
    expense: convertAmountFromMiliUnits(formattedExpense),
    remaining: convertAmountFromMiliUnits(formattedRemaining),
  };
}

export async function getActiveDaysFinancialReport(
  societyId: string,
  accountId: string,
  startDate: Date,
  endDate: Date,
) {
  const result = await db.$queryRawTyped(
    accountId
      ? activeDaysFinancialReportWithAccount(
          societyId,
          startDate,
          endDate,
          accountId,
        )
      : activeDaysFinancialReportWithoutAccount(societyId, startDate, endDate),
  );

  return result.map(({ date, income, expense }) => ({
    date,
    income: convertAmountFromMiliUnits(Number(income ?? 0)),
    expense: convertAmountFromMiliUnits(Number(expense ?? 0)),
  }));
}

export async function getPayeesReport(
  societyId: string,
  accountId: string | null,
  startDate: Date,
  endDate: Date,
) {
  const result = await db.$queryRawTyped(
    accountId
      ? payeeReportWithAccount(societyId, startDate, endDate, accountId)
      : payeeReportWithoutAccount(societyId, startDate, endDate),
  );

  const topPayees = result.slice(0, 3);
  const otherPayees = result.slice(3);

  const otherPayeeSum = otherPayees.reduce(
    (sum, current) =>
      sum + convertAmountFromMiliUnits(Number(current.value ?? 0)),
    0,
  );

  const finalPayees = topPayees.map(({ name, value }) => ({
    name,
    value: convertAmountFromMiliUnits(Number(value ?? 0)),
  }));

  if (otherPayees.length > 0) {
    finalPayees.push({
      name: "Other",
      value: otherPayeeSum,
    });
  }

  return finalPayees;
}

export async function getCategoryReport(
  societyId: string,
  accountId: string,
  startDate: Date,
  endDate: Date,
) {
  const result = await db.$queryRawTyped(
    accountId
      ? categoryReportWithAccount(societyId, startDate, endDate, accountId)
      : categoryReportWithoutAccount(societyId, startDate, endDate),
  );
  const topCategories = result.slice(0, 3);
  const otherCategories = result.slice(3);
  const otherCategorySum = otherCategories.reduce(
    (sum, current) => sum + convertAmountFromMiliUnits(Number(current.value)),
    0,
  );
  const finalCategories = topCategories.map(({ name, value }) => ({
    name,
    value: convertAmountFromMiliUnits(Number(value)),
  }));
  if (otherCategories.length > 0) {
    finalCategories.push({
      name: "Other",
      value: otherCategorySum,
    });
  }

  return finalCategories;
}
