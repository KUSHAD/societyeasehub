import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

const schema = z.object({
  announcementId: z.string().cuid(),
  apiKey: z.string().cuid(),
});

export async function GET(
  request: NextRequest,
  {
    params: { announcementId: _unsafeAnnouncementId },
  }: { params: { announcementId: string } },
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const _unsafeAPIKey = searchParams.get("apiKey");

    const { announcementId, apiKey } = schema.parse({
      announcementId: _unsafeAnnouncementId,
      apiKey: _unsafeAPIKey,
    });

    const societyId = apiKey.split(".")[0]!;

    const societyPerms = await db.society.findUnique({
      where: {
        id: societyId,
      },
      select: { integrateAnnouncements: true },
    });

    if (!societyPerms)
      return Response.json(
        {
          message: `No Society Found`,
        },
        { status: 404 },
      );

    if (!societyPerms.integrateAnnouncements)
      return Response.json(
        {
          message: `Announcement Integration Not Allowed`,
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

    const data = await db.announcement.findUnique({
      where: {
        id: announcementId,
        societyId,
      },
      select: {
        member: {
          select: {
            name: true,
            image: true,
          },
        },
        content: true,
        attachments: {
          select: {
            uri: true,
          },
        },
        comments: {
          select: {
            content: true,
            user: { select: { name: true, image: true } },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!data)
      return Response.json(
        {
          message: `No Roadmap Found`,
        },
        { status: 404 },
      );

    return Response.json({
      message: "Fetched Successfully",
      description: "Announcement with their attachments and their comments",
      data,
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
