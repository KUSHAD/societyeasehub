"use client";

import { useParams } from "next/navigation";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { toast } from "~/components/ui/use-toast";
import { createCardSchema } from "~/lib/validators/createCard";
import { api } from "~/trpc/react";

interface CardFormProps {
  listId: string;
}

export default function CardForm({ listId }: CardFormProps) {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();

  const { isLoading, mutate: create } = api.roadmapCard.create.useMutation({
    async onSuccess() {
      await utils.roadmapList.getBySociety.invalidate({ societyId: id });
      toast({
        title: "Message",
        description: "Card Created",
      });
    },
  });
  return (
    <>
      <AutoForm
        formSchema={createCardSchema}
        onSubmit={(_data) =>
          create({
            ..._data,
            listId,
            societyId: id,
          })
        }
      >
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AutoFormSubmit disabled={isLoading} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
