-- @param {String} $1:societyId
-- @param {DateTime} $2:startDate
-- @param {DateTime} $3:endDate
-- @param {String} $4:accountId
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
    t."societyId" = $1
    AND t."amount" < 0
    AND t."date" BETWEEN $2 AND $3
    AND t."accountId" = $4
GROUP BY
    p."name"
ORDER BY
    SUM(ABS(t."amount")) DESC;
