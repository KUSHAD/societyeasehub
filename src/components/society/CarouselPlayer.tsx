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

type CarouselPlayerProps = {
  medias: SafeMedia[];
};

export default function CarouselPlayer({ medias }: CarouselPlayerProps) {
  return (
    <Carousel>
      <CarouselContent>
        {medias.map((_media) => (
          <CarouselItem key={_media.id}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <AspectRatio ratio={1 / 1} className="w-full max-w-[400px]">
                    <Image
                      src={_media.uri}
                      fill
                      alt="Carousel Image"
                      quality={100}
                    />
                  </AspectRatio>
                </CardContent>
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
