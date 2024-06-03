import { NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import * as Sentry from "@sentry/nextjs";

export async function GET(req: Request) {
  const checkInId = Sentry.captureCheckIn({
    monitorSlug: "cron-jobs",
    status: "in_progress",
  });
  try {
    if (req.headers.get("Authorization") !== `Bearer ${env.CRON_JOB_SECRET}`) {
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug: "cron-jobs",
        status: "error",
      });
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

    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: "cron-jobs",
      status: "ok",
    });

    return NextResponse.json(
      {
        message: "Cron Job Ran Successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: "cron-jobs",
      status: "error",
    });
    if (error instanceof Error)
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 },
      );
  }
}
