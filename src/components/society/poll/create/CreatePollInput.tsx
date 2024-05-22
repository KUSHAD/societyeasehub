"use client";

import { useParams } from "next/navigation";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { toast } from "~/components/ui/use-toast";
import { createPollSchema } from "~/lib/validators/createPoll";
import { api } from "~/trpc/react";

export default function CreatePollInput() {
  const { id } = useParams<{ id: string }>();
  const { mutate: create, isLoading } = api.poll.create.useMutation({
    async onSuccess() {
      toast({
        title: "Message",
        description: "Poll Created",
      });
    },
  });
  return (
    <>
      <AutoForm
        formSchema={createPollSchema}
        onSubmit={(data) =>
          create({
            ...data,
            societyId: id,
          })
        }
      >
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Close</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AutoFormSubmit disabled={isLoading}>Create Poll</AutoFormSubmit>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
