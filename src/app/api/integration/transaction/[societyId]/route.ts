import { subDays } from "date-fns";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { fetchFinancialData } from "~/actions/fetchFinancialData";
import { db } from "~/server/db";
import { ratelimit } from "~/server/rateLimiter";
import { waitUntil } from "@vercel/functions";

const schema = z.object({
  societyId: z.string().cuid(),
  apiKey: z.string().cuid(),
});

export async function GET(
  request: NextRequest,
  {
    params: { societyId: _unsafeSocietyId },
  }: { params: { societyId: string } },
) {
  try {
    const { success, pending } = await ratelimit.limit(_unsafeSocietyId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    waitUntil(pending);

    if (!success)
      return Response.json(
        {
          message: `Too many requests`,
        },
        { status: 429 },
      );

    const searchParams = request.nextUrl.searchParams;
    const _unsafeAPIKey = searchParams.get("apiKey");

    const { societyId, apiKey } = schema.parse({
      societyId: _unsafeSocietyId,
      apiKey: _unsafeAPIKey,
    });

    const societyPerms = await db.society.findUnique({
      where: {
        id: societyId,
      },
      select: { integrateTransactions: true },
    });

    if (!societyPerms)
      return Response.json(
        {
          message: `No Society Found`,
        },
        { status: 404 },
      );

    if (!societyPerms.integrateTransactions)
      return Response.json(
        {
          message: `Transaction Integration Not Allowed`,
        },
        { status: 401 },
      );

    const apiKeyValid = await db.integrationAPIKey.findUnique({
      where: {
        key: apiKey,
        societyId,
      },
    });

    if (!apiKeyValid)
      return Response.json(
        {
          message: `Invalid API Key`,
        },
        { status: 401 },
      );

    const to = new Date();
    const from = subDays(to, 30);

    const data = await fetchFinancialData(societyId, "", from, to);

    console.log(data);

    return Response.json({
      message: "Fetched Successfully",
      description: "Financial Overview of all accounts for the past 30 days",
      data: {
        ...data,
        netBalance: data.remaining,
        remaining: undefined,
      },
    });
  } catch (error) {
    if (error instanceof Error)
      return Response.json(
        {
          message: error.message,
        },
        { status: 500 },
      );
  }
}
