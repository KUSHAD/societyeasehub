"use client";

import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import { newRole } from "~/lib/validators/newRole";
import { api } from "~/trpc/react";

export default function AddRole() {
  const [open, setOpen] = useState(false);
  const { societyId } = useParams<{ societyId: string }>();
  const utils = api.useUtils();
  const { mutate, isPending } = api.role.create.useMutation({
    onSuccess: async () => {
      await utils.role.getBySociety.invalidate();
      setOpen(false);
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={(_state) => setOpen(_state)}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mx-2" />
          New Role
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Role</AlertDialogTitle>
        </AlertDialogHeader>
        <AutoForm
          onSubmit={(data) =>
            mutate({
              ...data,
              societyId,
            })
          }
          formSchema={newRole}
          fieldConfig={{
            name: { description: "Name of the role" },
            accessSettings: {
              fieldType: "switch",
              description: "Access Settings Page",
            },
            createInvite: {
              fieldType: "switch",
              description: "Can create Invites",
            },
            assignRole: {
              fieldType: "switch",
              description: "Assign Role to Members",
            },
            kickUser: {
              fieldType: "switch",
              description: "Remove users from society",
            },
            manageChannel: {
              fieldType: "switch",
              description: "Manage Feed Channels",
            },
            sendMessage: {
              fieldType: "switch",
              description: "Send Message in Feed Channels",
            },
            createMeeting: {
              fieldType: "switch",
              description: "Can Create Meetings",
            },
            manageAccounts: {
              fieldType: "switch",
              description: "Can Manage Accounts",
            },
            manageRoadmap: {
              fieldType: "switch",
              description: "Can Manage Roadmaps",
            },
            canAnnounce: {
              fieldType: "switch",
              description: "Can Make Announcements",
            },
            canComment: {
              fieldType: "switch",
              description: "Can Comment in announcements",
            },
            canCreatePolls: {
              fieldType: "switch",
              description: "Can Create Polls",
            },
            canVote: {
              fieldType: "switch",
              description: "Can Vote In Polls",
            },
          }}
        >
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <AutoFormSubmit disabled={isPending}>Create</AutoFormSubmit>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AutoForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
