/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type $Enums } from "@prisma/client";
import { parse, subDays } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { canManageAccounts } from "~/actions/checkUserRole";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { db } from "~/server/db";
import xlsx from "xlsx";

const schema = z
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
  );

export async function GET(
  request: NextRequest,
  {
    params: { societyId: _unsafeSocietyId },
  }: { params: { societyId: string } },
) {
  try {
    const currentUser = await getCurrentUser();

    const searchParams = request.nextUrl.searchParams;
    const _unsafeTo = searchParams.get("to");
    const _unsafeFrom = searchParams.get("from");
    const _unsafeAccountId = searchParams.get("accountId");

    const _unsafeData = {
      from: _unsafeFrom,
      to: _unsafeTo,
      societyId: _unsafeSocietyId,
      accountId: _unsafeAccountId,
    };

    if (!currentUser)
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 },
      );

    const { from, societyId, to, accountId } = schema.parse(_unsafeData);
    const canManage = await canManageAccounts(societyId);

    if (!canManage)
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        { status: 401 },
      );

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;

    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    type Transaction =
      | {
          account: {
            name: string;
          };
          date: Date;
          amount: number;
          category: {
            name: string;
          } | null;
          payee: {
            type: $Enums.PAYEE_TYPE;
            name: string;
            email: string | null;
            address: string | null;
            identity: string | null;
            phoneNumber: string | null;
          };
          notes?: string;
        }
      | {
          date: Date;
          amount: number;
          notes: string | null;
          payeeName: string | undefined;
          payeeType: $Enums.PAYEE_TYPE;
          payeePh: string | null;
          payeeEmail: string | null;
          payeeIdentity: string | null;
          payeeAddress: string | null;
          categoryName: string;
        };

    const transactions = await db.financeTransaction.findMany({
      where: {
        accountId: accountId || undefined,

        societyId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        category: {
          select: {
            name: true,
          },
        },
        account: {
          select: {
            name: true,
          },
        },
        payee: {
          select: {
            name: true,
            identity: true,
            email: true,
            address: true,
            phoneNumber: true,
            type: true,
          },
        },
        amount: true,
        date: true,
        notes: true,
      },
    });

    const groupedTransactions = transactions.reduce(
      (acc, transaction) => {
        const accountName = transaction.account.name;
        acc[accountName] = acc[accountName] ?? [];

        const formattedTransaction = {
          date: transaction.date,
          amount: transaction.amount,
          categoryName: transaction.category?.name ?? "Uncategorized",
          payeeName: transaction.payee.name,
          payeeType: transaction.payee.type,
          payeePh: transaction.payee.phoneNumber ?? "Not Provided",
          payeeEmail: transaction.payee.email ?? "Not Provided",
          payeeIdentity: transaction.payee.identity ?? "Not Provided",
          payeeAddress: transaction.payee.address ?? "Not Provided",
          notes: transaction.notes,
        };
        acc[accountName].push(formattedTransaction);
        return acc;
      },
      {} as Record<string, Transaction[]>,
    );

    const workbook = xlsx.utils.book_new();
    for (const [accountName, transactions] of Object.entries(
      groupedTransactions,
    )) {
      const worksheetData = transactions.map((transaction) => ({
        Date: transaction.date,
        Amount: transaction.amount,
        Notes: transaction.notes,
        // @ts-ignore
        "Payee Name": transaction.payeeName,
        // @ts-ignore
        "Payee Type": transaction.payeeType,
        // @ts-ignore
        "Payee Phone": transaction.payeePh,
        // @ts-ignore
        "Payee Email": transaction.payeeEmail,
        // @ts-ignore
        "Payee Identity": transaction.payeeIdentity,
        // @ts-ignore
        "Payee Address": transaction.payeeAddress,
        // @ts-ignore
        "Category Name": transaction.categoryName,
      }));
      const worksheet = xlsx.utils.json_to_sheet(worksheetData);
      xlsx.utils.book_append_sheet(workbook, worksheet, accountName);
    }
    const excelBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="transactions.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 },
      );
    }
  }
}
