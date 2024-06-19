import { NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";

export async function GET(req: Request) {
  try {
    if (req.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    await db.meetingRoom.deleteMany({
      where: {
        endTime: {
          lte: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(
      {
        message: "Cron Job Ran Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 },
      );
  }
}
