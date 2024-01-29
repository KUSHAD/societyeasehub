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
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import { newRole } from "~/lib/validators/newRole";
import { api } from "~/trpc/react";

export default function AddRole() {
  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const { mutate, isLoading } = api.role.create.useMutation({
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
              societyId: id,
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
          }}
        >
          <AutoFormSubmit disabled={isLoading} className="w-full">
            Create
          </AutoFormSubmit>
        </AutoForm>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
