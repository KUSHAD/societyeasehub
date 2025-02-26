-- @param {String} $1:societyId
-- @param {DateTime} $2:startDate
-- @param {DateTime} $3:endDate
-- @param {String} $4:accountId
SELECT
    t."date" AS date,
    SUM(CASE WHEN t."amount" >= 0 THEN t."amount" ELSE 0 END) AS income,
    SUM(CASE WHEN t."amount" < 0 THEN ABS(t."amount") ELSE 0 END) AS expense
FROM
    "FinanceTransaction" t
INNER JOIN
    "FinanceAccount" a ON t."accountId" = a.id
WHERE
    t."societyId" = $1
    AND t."date" BETWEEN $2 AND $3
    AND t."accountId" = $4
GROUP BY
    t."date"
ORDER BY
    t."date";
