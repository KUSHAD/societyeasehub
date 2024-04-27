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
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const { isLoading, mutate: updateTitle } =
    api.roadmapList.updateTitle.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({
          societyId: id,
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
          societyId: id,
        })
      }
      formSchema={createListSchema}
      values={{
        title,
      }}
    >
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
          <AutoFormSubmit disabled={isLoading}>Rename</AutoFormSubmit>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AutoForm>
  );
}
