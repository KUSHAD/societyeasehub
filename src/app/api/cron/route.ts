import { NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";

export async function GET(req: Request) {
  if (req.headers.get("Authorization") !== `Bearer ${env.CRON_JOB_SECRET}`) {
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
}
