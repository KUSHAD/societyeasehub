"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { channelSchema } from "~/lib/validators/channel";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { toast } from "~/components/ui/use-toast";
import { type ChannelActionsProps } from "./ChannelActions";

export default function EditChannel({ channelName }: ChannelActionsProps) {
  const { channelId, societyId } = useParams<{
    societyId: string;
    channelId: string;
  }>();
  const utils = api.useUtils();
  const { isPending, mutate: editChannel } = api.channel.updateName.useMutation(
    {
      async onSuccess() {
        await utils.channel.getBySociety.invalidate({ societyId });
        await utils.channel.getName.invalidate({ channelId, societyId });
        toast({
          title: "Message",
          description: "Channel Edited",
        });
      },
    },
  );
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Edit Channel</AlertDialogTitle>
      </AlertDialogHeader>
      <AutoForm
        formSchema={channelSchema}
        values={{
          name: channelName,
        }}
        onSubmit={({ name }) =>
          editChannel({
            name,
            channelId,
            societyId,
          })
        }
      >
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <AutoFormSubmit disabled={isPending}>Update</AutoFormSubmit>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
