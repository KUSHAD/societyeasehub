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
  const { societyId } = useParams<{ societyId: string }>();
  const utils = api.useUtils();
  const { mutate: create, isPending } = api.poll.create.useMutation({
    async onSuccess() {
      await utils.poll.getBySociety.invalidate({ societyId });
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
            societyId,
          })
        }
      >
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Close</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AutoFormSubmit disabled={isPending}>Create Poll</AutoFormSubmit>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
