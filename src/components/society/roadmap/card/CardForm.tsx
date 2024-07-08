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
  const { societyId } = useParams<{ societyId: string }>();
  const utils = api.useUtils();

  const { isPending, mutate: create } = api.roadmapCard.create.useMutation({
    async onSuccess() {
      await utils.roadmapList.getBySociety.invalidate({ societyId });
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
            societyId,
          })
        }
      >
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AutoFormSubmit disabled={isPending} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
