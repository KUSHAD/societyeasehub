import { useParams } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "~/components/ui/use-toast";
import { UploadDropzone } from "~/lib/uploadthing";
import { uploaderClassName } from "~/lib/utils";
import { useMessageAttachmentStore } from "~/store/messageAttachment";

export default function AddChatAttachment({
  setIsUploading,
}: {
  setIsUploading: Dispatch<SetStateAction<boolean>>;
}) {
  const messageAttachmentStore = useMessageAttachmentStore();
  const { id, channelId } = useParams<{ id: string; channelId: string }>();

  return (
    <UploadDropzone
      input={{ societyId: id }}
      className={uploaderClassName}
      endpoint="messageAttachments"
      onUploadBegin={() => {
        setIsUploading(true);
      }}
      config={{
        appendOnPaste: true,
        mode: "auto",
      }}
      onClientUploadComplete={(files) => {
        files.forEach((_file) => {
          messageAttachmentStore.updateByChannel(channelId, _file.url);
        });
        setIsUploading(false);
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
        setIsUploading(false);
      }}
    />
  );
}
