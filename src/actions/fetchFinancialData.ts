import { db } from "~/server/db";

interface FinancialData {
  income: number;
  expense: number;
  remaining: number;
}

export async function fetchFinancialData(
  societyId: string,
  accountId: string, // Ensure accountId can be null or string
  startDate: Date,
  endDate: Date,
) {
  // Construct the SQL query with conditional filtering based on accountId

  // Execute the query with parameters
  const result = await db.$queryRaw<FinancialData[]>`
    SELECT 
      SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END) AS income,
      SUM(CASE WHEN t.amount < 0 THEN t.amount ELSE 0 END) AS expense,
      SUM(t.amount) AS remaining
    FROM
      "FinanceTransaction" t
    INNER JOIN
      "FinanceAccount" a ON t."accountId" = a.id
    WHERE
      t.societyId = ${societyId}
      ${accountId.length !== 0 ? `AND t."accountId" = ${accountId}` : ""}
      AND t.date >= ${startDate}
      AND t.date <= ${endDate};
  `;

  const { income, expense, remaining } = result[0]!;

  // Ensure default values if result is null
  const formattedIncome = income || 0;
  const formattedExpense = expense || 0;
  const formattedRemaining = remaining || 0;

  return {
    income: formattedIncome,
    expense: formattedExpense,
    remaining: formattedRemaining,
  };
}
