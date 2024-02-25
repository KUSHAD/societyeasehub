"use client";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import { getMediaTypeFromURL } from "~/lib/utils";

export default function MediaRenderer({
  uri,
  showDelete = false,
}: {
  uri: string;
  showDelete?: boolean;
}) {
  const [type, setType] = useState("image/png");

  const getMimeType = useCallback(async () => {
    const mimeType = await getMediaTypeFromURL(uri);
    setType(mimeType);
  }, [uri]);

  useEffect(() => {
    void getMimeType();

    return () => {
      setType("image/png");
    };
  }, [getMimeType]);

  return (
    <div className="my-2 flex aspect-square w-full flex-col items-center justify-center p-2">
      <AspectRatio ratio={1 / 1} className="w-full max-w-full">
        {type.startsWith("image") ? (
          <Image src={uri} fill alt="Carousel Image" quality={100} />
        ) : type.startsWith("video") ? (
          <video className="h-full w-full" controls autoPlay={false}>
            <source src={uri} type={type} />
          </video>
        ) : (
          <iframe src={uri} className="h-full w-full" />
        )}
      </AspectRatio>
      <div className="mt-1 flex flex-row">
        {showDelete ? (
          <>
            <Button variant="destructive" size="icon" className="mx-2">
              <Trash2Icon />
            </Button>
            <Button variant="outline" size="icon" className="mx-2">
              <ExternalLinkIcon />
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
