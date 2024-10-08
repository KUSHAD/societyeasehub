"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { api } from "~/trpc/react";
import ListWrapper from "./ListWrapper";
import { Button } from "../../../ui/button";
import { Plus } from "lucide-react";
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
import { toast } from "../../../ui/use-toast";

export default function ListForm() {
  const { societyId } = useParams<{ societyId: string }>();
  const utils = api.useUtils();
  const { isPending, data } = api.perms.canManageRoadmaps.useQuery({
    societyId,
  });
  const { isPending: creating, mutate: createList } =
    api.roadmapList.createList.useMutation({
      async onSuccess() {
        await utils.roadmapList.getBySociety.invalidate({ societyId });

        toast({
          title: "Message",
          description: "List Created",
        });
      },
    });
  return isPending ? (
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
                  societyId,
                })
              }
              formSchema={createListSchema}
            >
              <AlertDialogFooter>
                <AlertDialogCancel disabled={creating}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <AutoFormSubmit disabled={creating} />
                </AlertDialogAction>
              </AlertDialogFooter>
            </AutoForm>
          </AlertDialogContent>
        </AlertDialog>
      </ListWrapper>
    )
  );
}
