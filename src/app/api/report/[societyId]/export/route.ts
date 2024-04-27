import { endOfDay, format, startOfDay } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { canManageAccounts } from "~/actions/checkUserRole";
import { getCurrentUser } from "~/actions/getCurrentUser";
import { commonTransactionInput } from "~/server/api/routers/transaction/transaction";
import { db } from "~/server/db";

export async function GET(
  request: NextRequest,
  {
    params: { societyId: _unsafeSocietyId },
  }: { params: { societyId: string } },
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser)
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 },
      );

    const searchParams = request.nextUrl.searchParams;
    const _unsafeTo = searchParams.get("to");
    const _unsafeFrom = searchParams.get("from");

    const _unsafeData = {
      from: _unsafeFrom,
      to: _unsafeTo,
      societyId: _unsafeSocietyId,
    };

    const { from, societyId, to } = commonTransactionInput.parse(_unsafeData);
    const canManage = await canManageAccounts(societyId);

    if (!canManage)
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        { status: 401 },
      );

    const data = await db.transaction.findMany({
      where: {
        societyId,
        date: {
          lte: endOfDay(to),
          gte: startOfDay(from),
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
        description: true,
        society: { select: { name: true } },
      },
      orderBy: {
        date: "asc",
      },
    });

    if (data.length === 0)
      return NextResponse.json(
        {
          message: "No data found for selected time period",
        },
        { status: 400 },
      );

    const formattedData = data.map((_data) => ({
      "Date of Transaction": format(_data.date, "dd/MM/yyyy"),
      "Transaction Type": _data.type,
      Amount: new Intl.NumberFormat("en-In", {
        style: "currency",
        currency: "INR",
      }).format(_data.amount),
      Description: _data.description ?? "Not Provided",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData, {});

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction Details");

    const buf = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    }) as unknown;

    return new Response(buf as BodyInit, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="Transaction-${data[0]!.society.name}-${format(from, "dd/MM/yyyy")}-${format(to, "dd/MM/yyyy")}.xlsx"`,
        "Content-Type": "application/vnd.ms-excel",
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
