-- @param {String} $1:societyId
-- @param {DateTime} $2:startDate
-- @param {DateTime} $3:endDate
-- @param {String} $4:accountId
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
    t."societyId" = $1
    AND t."amount" < 0
    AND t."date" BETWEEN $2 AND $3
    AND t."accountId" = $4
GROUP BY
    c."name"
ORDER BY
    SUM(ABS(t."amount")) DESC;
