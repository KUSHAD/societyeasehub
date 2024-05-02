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
  const { channelId, id } = useParams<{ id: string; channelId: string }>();
  const utils = api.useUtils();
  const { isLoading, mutate: editChannel } = api.channel.updateName.useMutation(
    {
      async onSuccess() {
        await utils.channel.getBySociety.invalidate({ societyId: id });
        await utils.channel.getName.invalidate({ channelId, societyId: id });
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
            societyId: id,
          })
        }
      >
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <AutoFormSubmit disabled={isLoading}>Update</AutoFormSubmit>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
