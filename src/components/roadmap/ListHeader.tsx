"use client";

import { type RoadmapList } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "../ui/auto-form";
import { createListSchema } from "~/lib/validators/createList";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { toast } from "../ui/use-toast";

interface ListHeaderProps {
  list: RoadmapList;
}

export default function ListHeader({ list }: ListHeaderProps) {
  const utils = api.useUtils();
  const { id } = useParams<{ id: string }>();

  const { isLoading, mutate: updateListTitle } =
    api.roadmapList.updateListTitle.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({ societyId: id });
        toast({
          title: "Message",
          description: "Title Updated",
        });
      },
    });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex cursor-pointer items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
          <div className="h-7 w-full border-transparent px-2.5 py-1 text-sm font-medium">
            {list.title}
          </div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update List Name</AlertDialogTitle>
        </AlertDialogHeader>
        <AutoForm
          onSubmit={(data) =>
            updateListTitle({
              ...data,
              societyId: id,
              listId: list.id,
            })
          }
          formSchema={createListSchema}
          values={{
            title: list.title,
          }}
        >
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AutoFormSubmit disabled={isLoading}>Update</AutoFormSubmit>
          </AlertDialogFooter>
        </AutoForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
