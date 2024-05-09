"use client";

import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import { getMediaTypeFromURL } from "~/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { deleteDraftAttachment } from "~/actions/deleteAttachment";
import { toast } from "~/components/ui/use-toast";
import { useMessageAttachmentStore } from "~/store/messageAttachment";
import { useAnnouncementAttachmentStore } from "~/store/announcementAttachment";

export default function MediaRenderer({
  uri,
  showDelete = false,
  isMessage = true,
}: {
  uri: string;
  showDelete?: boolean;
  isMessage?: boolean;
}) {
  const [type, setType] = useState("");
  const draftDeleteAction = useAction(deleteDraftAttachment);
  const messageAttachmentStore = useMessageAttachmentStore();
  const announcementAttachmentStore = useAnnouncementAttachmentStore();

  const getMimeType = useCallback(async () => {
    const mimeType = await getMediaTypeFromURL(uri);
    setType(mimeType);
  }, [uri]);

  useEffect(() => {
    void getMimeType();
  }, [getMimeType]);

  return (
    <div className="my-2 flex aspect-square flex-col items-center justify-center p-2">
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
      <div className="mt-1 ">
        {showDelete ? (
          <Button
            onClick={() => {
              draftDeleteAction.execute({ uri });
              if (isMessage) {
                messageAttachmentStore.deleteByUri(uri);
              } else {
                announcementAttachmentStore.deleteByUri(uri);
              }
              if (draftDeleteAction.result.data?.failure) {
                toast({
                  title: "Error",
                  description: draftDeleteAction.result.data.failure,
                });
              }
              if (draftDeleteAction.result.data?.success) {
                toast({
                  title: "Success",
                  description: draftDeleteAction.result.data.success,
                });
              }
            }}
            variant="destructive"
            disabled={draftDeleteAction.status === "executing"}
            className="w-full"
          >
            <Trash2Icon />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
