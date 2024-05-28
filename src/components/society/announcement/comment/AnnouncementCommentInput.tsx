"use client";

import { useParams } from "next/navigation";
import { z } from "zod";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function AnnouncementCommentInput(props: {
  announcementId: string;
}) {
  const { societyId } = useParams<{ societyId: string }>();
  const utils = api.useUtils();
  const { isLoading, mutate: create } =
    api.announcementComment.create.useMutation({
      async onSuccess() {
        await utils.announcementComment.getByAnnouncement.invalidate({
          announcementId: props.announcementId,
        });
        await utils.announcement.getBySociety.invalidate({
          societyId,
        });
        toast({
          title: "Message",
          description: "Comment Posted",
        });
      },
    });
  return (
    <AutoForm
      className="mt-2 px-2"
      formSchema={z.object({
        content: z.string().min(1, "Required").max(50, "Max 50 Characters"),
      })}
      onSubmit={(data) =>
        create({
          ...data,
          announcementId: props.announcementId,
          societyId,
        })
      }
      fieldConfig={{
        content: {
          inputProps: {
            showLabel: false,
            placeholder: "Comment ...",
          },
        },
      }}
    >
      <div className="flex flex-row">
        <div className="mr-auto" />
        <AutoFormSubmit disabled={isLoading}>Comment</AutoFormSubmit>
      </div>
    </AutoForm>
  );
}
