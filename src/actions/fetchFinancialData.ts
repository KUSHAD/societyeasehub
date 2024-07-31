import "server-only";

import { Prisma } from "@prisma/client";
import type { FinancialData, ActiveDaysData, RawGroupData } from "~/lib/types";
import { convertAmountFromMiliUnits } from "~/lib/utils";
import { db } from "~/server/db";

export async function fetchFinancialData(
  societyId: string,
  accountId: string,
  startDate: Date,
  endDate: Date,
) {
  let baseQuery = Prisma.sql`
  SELECT 
    SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END) AS income,
    SUM(CASE WHEN t.amount < 0 THEN ABS(t."amount") ELSE 0 END) AS expense,
    SUM(t.amount) AS remaining
  FROM
    "FinanceTransaction" t
  INNER JOIN
    "FinanceAccount" a ON t."accountId" = a.id
  WHERE
    t."societyId" = ${societyId}
    AND t."date" BETWEEN ${startDate} AND ${endDate}
  `;

  if (accountId) {
    baseQuery = Prisma.sql`${baseQuery} AND t."accountId" = ${accountId}`;
  }

  const result = await db.$queryRaw<FinancialData[]>(baseQuery);

  const { income, expense, remaining } = result[0]!;

  const formattedIncome = Number(income || 0);
  const formattedExpense = Number(expense || 0);
  const formattedRemaining = Number(remaining || 0);

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
): Promise<ActiveDaysData[]> {
  let activeDaysQuery = Prisma.sql`
  SELECT
    t."date" as date,
    SUM(CASE WHEN t."amount" >= 0 THEN t."amount" ELSE 0 END) AS income,
    SUM(CASE WHEN t."amount" < 0 THEN ABS(t."amount") ELSE 0 END) AS expense
  FROM
    "FinanceTransaction" t
  INNER JOIN
    "FinanceAccount" a ON t."accountId" = a.id
  WHERE
    t."societyId" = ${societyId}
    AND t."date" BETWEEN ${startDate} AND ${endDate}
  `;

  if (accountId) {
    activeDaysQuery = Prisma.sql`${activeDaysQuery} AND t."accountId" = ${accountId}`;
  }

  activeDaysQuery = Prisma.sql`${activeDaysQuery}
      GROUP BY
        t."date"
      ORDER BY
        t."date";
      `;

  const result = await db.$queryRaw<ActiveDaysData[]>(activeDaysQuery);

  return result.map(({ date, income, expense }) => ({
    date,
    income: convertAmountFromMiliUnits(Number(income || 0)),
    expense: convertAmountFromMiliUnits(Number(expense || 0)),
  }));
}

export async function getPayeesReport(
  societyId: string,
  accountId: string | null,
  startDate: Date,
  endDate: Date,
): Promise<RawGroupData[]> {
  let payeeQuery = Prisma.sql`
  SELECT
    p."name" AS name,
    SUM(ABS(t."amount")) AS value
  FROM
    "FinanceTransaction" t
  INNER JOIN
    "FinanceAccount" a ON t."accountId" = a.id
  INNER JOIN
    "FinancePayee" p ON t."payeeId" = p.id
  WHERE
    t."societyId" = ${societyId}
    AND t."amount" < 0
    AND t."date" BETWEEN ${startDate} AND ${endDate}
  `;

  if (accountId) {
    payeeQuery = Prisma.sql`${payeeQuery} AND t."accountId" = ${accountId}`;
  }

  payeeQuery = Prisma.sql`${payeeQuery}
   GROUP BY
      p."name"
    ORDER BY
      SUM(ABS(t."amount")) DESC;
  `;

  const payee = await db.$queryRaw<RawGroupData[]>(payeeQuery);

  const topPayees = payee.splice(0, 3);
  const otherPayees = payee.splice(3);

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
): Promise<RawGroupData[]> {
  let categoryQuery = Prisma.sql`
   SELECT
    c."name" AS name,
    SUM(ABS(t."amount")) AS value
  FROM
    "FinanceTransaction" t
  INNER JOIN
    "FinanceAccount" a ON t."accountId" = a.id
  INNER JOIN
    "FinanceCategory" c ON t."categoryId" = c.id
  WHERE
    t."societyId" = ${societyId}
    AND t."amount" < 0
    AND t."date" BETWEEN ${startDate} AND ${endDate}
  `;

  if (accountId) {
    categoryQuery = Prisma.sql`${categoryQuery} AND t."accountId" = ${accountId}`;
  }

  categoryQuery = Prisma.sql`${categoryQuery}
   GROUP BY
      c."name"
    ORDER BY
      SUM(ABS(t."amount")) DESC;
  `;

  const category = await db.$queryRaw<RawGroupData[]>(categoryQuery);

  const topCategories = category.splice(0, 3);
  const otherCategories = category.splice(3);
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
