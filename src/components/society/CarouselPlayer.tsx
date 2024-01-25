import { type SafeMedia } from "~/lib/types";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Loader2, Trash } from "lucide-react";
type CarouselPlayerProps = {
  medias: SafeMedia[];
  isDelete?: boolean;
};

export default function CarouselPlayer({
  medias,
  isDelete,
}: CarouselPlayerProps) {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = api.useUtils();

  const { mutate: deleteMedia, isLoading } =
    api.societyMedia.delete.useMutation({
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },
      retryDelay: 500,
      onSuccess: async () => {
        await utils.societyMedia.getBySociety.invalidate();
      },
      onMutate({ id }) {
        setCurrentlyDeletingFile(id);
      },
      onSettled() {
        setCurrentlyDeletingFile(null);
      },
    });

  return (
    <Carousel>
      <CarouselContent>
        {medias.map((_media) => (
          <CarouselItem key={_media.id}>
            <Card>
              <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                <AspectRatio ratio={1 / 1} className="w-full max-w-full">
                  <Image
                    src={_media.uri}
                    fill
                    alt="Carousel Image"
                    quality={100}
                  />
                </AspectRatio>
                {isDelete && (
                  <Button
                    disabled={isLoading}
                    onClick={() => deleteMedia({ id: _media.id })}
                    className="my-2 w-full"
                    variant="destructive"
                  >
                    {currentlyDeletingFile === _media.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export function CarouselPlayerSkeleton() {
  return (
    <Carousel>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6" />
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
