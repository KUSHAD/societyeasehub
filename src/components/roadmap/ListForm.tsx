"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { api } from "~/trpc/react";
import ListWrapper from "./ListWrapper";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
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
import { toast } from "../ui/use-toast";

export default function ListForm() {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const { isLoading, data } = api.member.canManageRoadmaps.useQuery({
    societyId: id,
  });
  const { isLoading: creating, mutate: createList } =
    api.roadmapList.createList.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({ societyId: id });

        toast({
          title: "Message",
          description: "List Created",
        });
      },
    });
  return isLoading ? (
    <Skeleton className="h-10 w-[150px]" />
  ) : (
    data && (
      <ListWrapper>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={creating}>
              <Plus className="mx-1" />
              Add a List
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add a List</AlertDialogTitle>
            </AlertDialogHeader>
            <AutoForm
              onSubmit={(data) =>
                createList({
                  ...data,
                  societyId: id,
                })
              }
              formSchema={createListSchema}
            >
              <AlertDialogFooter>
                <AlertDialogCancel disabled={creating}>
                  Cancel
                </AlertDialogCancel>
                <AutoFormSubmit disabled={creating} />
              </AlertDialogFooter>
            </AutoForm>
          </AlertDialogContent>
        </AlertDialog>
      </ListWrapper>
    )
  );
}
