"use client";

import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { createRoomSchema } from "~/lib/validators/createRoom";
import { api } from "~/trpc/react";

export default function CreateMeetingForm() {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const { mutate: createMeeting, isLoading } =
    api.meetingRoom.create.useMutation({
      onSuccess: async () => {
        await utils.meetingRoom.getBySociety.invalidate({ societyId: id });
        toast({
          title: "Success",
          description: "Meeting Created",
        });
      },
    });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mx-2" />
          New Meeting
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New Meeting</AlertDialogTitle>
        </AlertDialogHeader>
        <AutoForm
          onSubmit={(data) => {
            createMeeting({
              ...data,
              societyId: id,
            });
          }}
          formSchema={createRoomSchema}
          fieldConfig={{
            description: {
              fieldType: "textarea",
            },
            startTime: {
              inputProps: {
                type: "datetime-local",
              },
            },
            endTime: {
              inputProps: {
                type: "datetime-local",
              },
            },
          }}
        >
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <AutoFormSubmit disabled={isLoading}>Create</AutoFormSubmit>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AutoForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
