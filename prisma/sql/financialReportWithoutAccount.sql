-- @param {String} $1:societyId
-- @param {DateTime} $2:startDate
-- @param {DateTime} $3:endDate
SELECT 
  SUM(CASE WHEN t.amount >= 0 THEN t.amount ELSE 0 END) AS income,
  SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END) AS expense,
  SUM(t.amount) AS remaining
FROM "FinanceTransaction" t
INNER JOIN 
  "FinanceAccount" a ON t."accountId" = a.id
WHERE 
  t."societyId" = $1
  AND t."date" BETWEEN $2 AND $3;
