"use client";

import { useParams } from "next/navigation";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { toast } from "~/components/ui/use-toast";
import { createListSchema } from "~/lib/validators/createList";
import { api } from "~/trpc/react";

interface EditListProps {
  listId: string;
  title: string;
}

export default function EditList({ title, listId }: EditListProps) {
  const { societyId } = useParams<{ societyId: string }>();
  const utils = api.useUtils();
  const { isPending, mutate: updateTitle } =
    api.roadmapList.updateTitle.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({
          societyId,
        });
        toast({
          title: "Message",
          description: "List Renamed",
        });
      },
    });
  return (
    <AutoForm
      onSubmit={(data) =>
        updateTitle({
          ...data,
          listId,
          societyId,
        })
      }
      formSchema={createListSchema}
      values={{
        title,
      }}
    >
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
          <AutoFormSubmit disabled={isPending}>Rename</AutoFormSubmit>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AutoForm>
  );
}
