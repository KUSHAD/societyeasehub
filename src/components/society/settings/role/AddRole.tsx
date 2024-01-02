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
import { toast } from "~/components/ui/use-toast";
import { newRole } from "~/lib/validators/newRole";
import { api } from "~/trpc/react";

export default function AddRole() {
  const [open, setOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { mutate, isLoading } = api.role.create.useMutation({
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    retry(failureCount) {
      if (failureCount >= 3) return true;

      return false;
    },

    onSuccess() {
      setOpen(false);
    },

    retryDelay: 500,
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
            accessDanger: {
              fieldType: "switch",
              description: "Access to Danger Settings Page",
            },
            accessGeneral: {
              fieldType: "switch",
              description: "Access to General Settings Page",
            },
            accessRole: {
              fieldType: "switch",
              description: "Access to Role Settings Page",
            },
            createInvite: {
              fieldType: "switch",
              description: "Can create Invites",
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
