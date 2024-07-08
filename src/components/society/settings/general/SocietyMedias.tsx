"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import CarouselPlayer, { CarouselPlayerSkeleton } from "../../CarouselPlayer";
import SocietyImageUploader from "./SocietyImageUploader";
import NotFound from "~/components/NotFound";

export default function SocietyMedias() {
  const { societyId } = useParams<{ societyId: string }>();
  const { data: medias, isPending } = api.societyMedia.getBySociety.useQuery({
    societyId,
  });
  return (
    <Card>
      <CardHeader className="flex flex-row">
        <CardTitle className="my-3 mr-auto">Medias</CardTitle>
        <SocietyImageUploader />
      </CardHeader>
      <CardContent className="mx-auto my-4 w-full max-w-[400px]">
        {isPending ? (
          <CarouselPlayerSkeleton />
        ) : medias && medias.length !== 0 ? (
          <CarouselPlayer isDelete medias={medias} />
        ) : (
          <NotFound message="You haven't uploaded any Picture" />
        )}
      </CardContent>
    </Card>
  );
}
