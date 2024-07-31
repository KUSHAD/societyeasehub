import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

const schema = z.object({
  roadmapId: z.string().cuid(),
  apiKey: z.string().cuid(),
});

export async function GET(
  request: NextRequest,
  {
    params: { roadmapId: _unsafeRoadmapId },
  }: { params: { roadmapId: string } },
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const _unsafeAPIKey = searchParams.get("apiKey");

    const { roadmapId, apiKey } = schema.parse({
      roadmapId: _unsafeRoadmapId,
      apiKey: _unsafeAPIKey,
    });

    const societyId = apiKey.split(".")[0]!;

    const societyPerms = await db.society.findUnique({
      where: {
        id: societyId,
      },
      select: { integrateRoadmaps: true },
    });

    if (!societyPerms)
      return Response.json(
        {
          message: `No Society Found`,
        },
        { status: 404 },
      );

    if (!societyPerms.integrateRoadmaps)
      return Response.json(
        {
          message: `Roadmaps Integration Not Allowed`,
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

    const data = await db.roadmapList.findUnique({
      where: {
        id: roadmapId,
        societyId,
      },
      select: {
        title: true,
        cards: {
          select: {
            title: true,
            description: true,
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
      description: "Roadmap details along with card",
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
