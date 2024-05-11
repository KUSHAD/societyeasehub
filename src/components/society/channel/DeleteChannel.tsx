"use client";

import { useParams, useRouter } from "next/navigation";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { useMessageStore } from "~/store/message";
import { useMessageAttachmentStore } from "~/store/messageAttachment";
import { api } from "~/trpc/react";

export default function DeleteChannel() {
  const { id, channelId } = useParams<{ id: string; channelId: string }>();
  const router = useRouter();
  const utils = api.useUtils();
  const messageStore = useMessageStore();
  const messageAttachmentStore = useMessageAttachmentStore();

  const { isLoading, mutate: deleteChannel } = api.channel.delete.useMutation({
    onMutate() {
      router.push(`/society/${id}/feed/announcement`);
    },
    async onSuccess() {
      await utils.channel.getBySociety.invalidate({ societyId: id });

      messageStore.updateByChannel(channelId, "");
      messageAttachmentStore.clearByChannel(channelId);

      toast({
        title: "Message",
        description: "Channel Deleted",
      });
    },
  });

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Channel</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        This action deletes all the messages and attachments associated with
        this channel. Pls be certain while deleting this. This action cannot be
        undone
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            disabled={isLoading}
            onClick={() =>
              deleteChannel({
                channelId,
                societyId: id,
              })
            }
          >
            Delete
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
