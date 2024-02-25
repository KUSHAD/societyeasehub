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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

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
          <strong className="my-2">Add Attachments</strong>
          <AddChatAttachment setIsUploading={setIsUploading} />
          {messageAttachmentStore.getByChannel(channelId).length > 0 && (
            <>
              <strong className="my-2 ">View Attachments</strong>
              <div className="flex justify-center">
                <Carousel className="h-[200px] w-[200px] md:h-[300px] md:w-[300px]">
                  <CarouselContent>
                    {messageAttachmentStore
                      .getByChannel(channelId)
                      .map(async (_uri) => (
                        <CarouselItem key={_uri}>
                          <MediaRenderer uri={_uri} showDelete />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  {messageAttachmentStore.getByChannel(channelId).length >
                    1 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
                </Carousel>
              </div>
            </>
          )}
        </div>
        <DrawerFooter className="mt-8">
          <DrawerClose asChild>
            <Button disabled={isUploading} className="my-2" variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
