"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { channelSchema } from "~/lib/validators/channel";
import { api } from "~/trpc/react";

export default function CreateChannel() {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const router = useRouter();
  const { mutate: create, isLoading } = api.channel.create.useMutation({
    onSuccess: async (data) => {
      await utils.channel.getBySociety.invalidate();
      toast({
        title: "Success",
        description: "Channel Created",
      });
      router.push(`/society/${id}/feed/channel/${data.id}`);
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="my-2 w-full" variant="default">
          <Plus className="mx-2 my-1" />
          New Channel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Channel</AlertDialogTitle>
        </AlertDialogHeader>
        <AutoForm
          onSubmit={(data) =>
            create({
              ...data,
              societyId: id,
            })
          }
          formSchema={channelSchema}
        >
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AutoFormSubmit disabled={isLoading}>Create</AutoFormSubmit>
          </AlertDialogFooter>
        </AutoForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
