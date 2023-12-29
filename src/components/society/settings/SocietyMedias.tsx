"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { api } from "~/trpc/react";
import CarouselPlayer, { CarouselPlayerSkeleton } from "../CarouselPlayer";
import { Ghost } from "lucide-react";
import SocietyImageUploader from "./SocietyImageUploader";
import { toast } from "~/components/ui/use-toast";

export default function SocietyMedias() {
  const { id } = useParams<{ id: string }>();
  const { data: medias, isLoading } = api.societyMedia.getSocietyMedia.useQuery(
    {
      societyId: id,
    },
    {
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },
      retryDelay: 500,
    },
  );
  return (
    <Card>
      <CardHeader className="flex flex-row">
        <CardTitle className="my-3 mr-auto">Medias</CardTitle>
        <SocietyImageUploader />
      </CardHeader>
      <CardContent className="mx-auto my-4 w-full max-w-[400px]">
        {isLoading ? (
          <CarouselPlayerSkeleton />
        ) : medias && medias.length !== 0 ? (
          <CarouselPlayer isDelete medias={medias} />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="text-xl font-semibold">
              You have not uploaded any picture
            </h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
