"use client";

import { FileIcon } from "@radix-ui/react-icons";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { useMessageAttachmentStore } from "~/store/messageAttachment";
import AddChatAttachment from "./AddChatAttachment";
import MediaRenderer from "./MediaRenderer";
import { getMediaTypeFromURL } from "~/lib/utils";

export default function ChatAttachment() {
  const [isUploading, setIsUploading] = useState(false);
  const messageAttachmentStore = useMessageAttachmentStore();
  const { channelId } = useParams<{ channelId: string }>();
  return (
    <Drawer dismissible={!isUploading}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="mr-2 rounded-full"
        >
          <FileIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Attachments</DrawerTitle>
          <DrawerDescription>
            Add and view attachments for your message
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-2">
          <AddChatAttachment setIsUploading={setIsUploading} />
          <div className="snap-x snap-start overflow-x-auto">
            {messageAttachmentStore
              .getByChannel(channelId)
              .map(async (_uri) => {
                const type = await getMediaTypeFromURL(_uri);
                return (
                  <MediaRenderer
                    key={_uri}
                    uri={_uri}
                    type={type as "image" | "video"}
                  />
                );
              })}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button disabled={isUploading} variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
