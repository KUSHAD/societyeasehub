"use client";

import { type RoadmapCard } from "@prisma/client";
import { useParams } from "next/navigation";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { toast } from "~/components/ui/use-toast";
import { updateCardSchema } from "~/lib/validators/updateCard";
import { api } from "~/trpc/react";

interface EditCardProps {
  card: RoadmapCard;
}

export default function EditCard({ card }: EditCardProps) {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();
  const { mutate: edit, isPending } = api.roadmapCard.edit.useMutation({
    async onSuccess() {
      await utils.roadmapList.getBySociety.invalidate({
        societyId,
      });
      await utils.roadmapCard.getById.invalidate({
        cardId: card.id,
        societyId,
      });
      toast({
        title: "Message",
        description: "Card Updated",
      });
    },
  });
  return (
    <>
      <AutoForm
        values={{
          description: card.description!,
          title: card.title,
        }}
        onSubmit={(data) =>
          edit({
            ...data,
            societyId,
            cardId: card.id,
          })
        }
        fieldConfig={{
          description: {
            fieldType: "textarea",
            inputProps: {
              className: "resize-none",
            },
          },
        }}
        formSchema={updateCardSchema}
      >
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AutoFormSubmit disabled={isPending}>Update</AutoFormSubmit>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
