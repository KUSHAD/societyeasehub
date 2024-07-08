"use client";

import { type RoadmapList } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "../../../ui/auto-form";
import { createListSchema } from "~/lib/validators/createList";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { toast } from "../../../ui/use-toast";
import ListOptions from "./ListOptions";

interface ListHeaderProps {
  list: RoadmapList;
}

export default function ListHeader({ list }: ListHeaderProps) {
  const utils = api.useUtils();
  const { societyId } = useParams<{ societyId: string }>();

  const { isPending, mutate: updateListTitle } =
    api.roadmapList.updateTitle.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({ societyId });
        toast({
          title: "Message",
          description: "Title Updated",
        });
      },
    });
  return (
    <AlertDialog>
      <div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
        <AlertDialogTrigger asChild>
          <div className="h-7 w-full cursor-pointer border-transparent px-2.5 py-1 text-sm font-medium">
            {list.title}
          </div>
        </AlertDialogTrigger>
        <ListOptions list={list} />
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update List Name</AlertDialogTitle>
        </AlertDialogHeader>
        <AutoForm
          onSubmit={(data) =>
            updateListTitle({
              ...data,
              societyId,
              listId: list.id,
            })
          }
          formSchema={createListSchema}
          values={{
            title: list.title,
          }}
        >
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <AutoFormSubmit disabled={isPending}>Update</AutoFormSubmit>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AutoForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
