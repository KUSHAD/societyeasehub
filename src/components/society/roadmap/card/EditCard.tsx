"use client";

import { type RoadmapCard } from "@prisma/client";
import { useParams } from "next/navigation";
import {
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
  const { id } = useParams<{ id: string }>();

  const utils = api.useUtils();
  const { mutate: edit, isLoading } = api.roadmapCard.edit.useMutation({
    async onSuccess() {
      await utils.roadmapList.getBySociety.invalidate({
        societyId: id,
      });
      await utils.roadmapCard.getById.invalidate({
        cardId: card.id,
        societyId: id,
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
            societyId: id,
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
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AutoFormSubmit disabled={isLoading}>Update</AutoFormSubmit>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
