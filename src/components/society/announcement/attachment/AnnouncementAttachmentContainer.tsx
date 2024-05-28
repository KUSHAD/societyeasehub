"use client";

import { DrawerFooter, DrawerClose } from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { useParams } from "next/navigation";
import { UploadDropzone } from "~/lib/uploadthing";
import { uploaderClassName } from "~/lib/utils";
import { useAnnouncementAttachmentStore } from "~/store/announcementAttachment";
import { useState } from "react";
import { toast } from "~/components/ui/use-toast";

import MediaRenderer from "../../channel/chat/MediaRenderer";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export default function AnnouncementAttachmentContainer() {
  const { societyId } = useParams<{ societyId: string }>();
  const announcementAttachmentStore = useAnnouncementAttachmentStore();
  const [uploading, setUploading] = useState<boolean>(false);
  return (
    <>
      <UploadDropzone
        className={uploaderClassName}
        endpoint="announcementAttachments"
        input={{
          societyId,
          currentFileCount:
            announcementAttachmentStore.getBySociety(societyId).length,
        }}
        config={{
          appendOnPaste: true,
          mode: "auto",
        }}
        onUploadBegin={() => {
          setUploading(true);
        }}
        onClientUploadComplete={(files) => {
          files.forEach((_file) => {
            announcementAttachmentStore.updateBySociety(societyId, _file.url);
          });
          setUploading(false);
          toast({
            title: "Success",
            description: "Media Uploaded",
          });
        }}
        onUploadError={({ message }) => {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
          setUploading(false);
        }}
      />
      {announcementAttachmentStore.getBySociety(societyId).length > 0 && (
        <>
          <strong className="my-2 ">View Attachments</strong>
          <div className="flex flex-row overflow-x-auto">
            {announcementAttachmentStore.getBySociety(societyId).map((_uri) => (
              <AspectRatio className="h-[200px] w-[200px]" ratio={1 / 1}>
                <MediaRenderer
                  uri={_uri}
                  isMessage={false}
                  showDelete
                  key={_uri}
                />
              </AspectRatio>
            ))}
          </div>
        </>
      )}
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline" className="w-full" disabled={uploading}>
            Close
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}
