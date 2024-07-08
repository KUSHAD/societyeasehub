"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import AutoForm, { AutoFormSubmit } from "../ui/auto-form";
import { z } from "zod";

export default function UpdateProfileName({ name }: { name: string }) {
  const [open, setIsOpen] = useState(false);
  const router = useRouter();

  const { isPending, mutate: updateName } = api.user.updateName.useMutation({
    onSuccess() {
      toast({
        title: "Success",
        description: "Profile Picture Updated",
      });
      setIsOpen(false);
      router.refresh();
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={(_open) => setIsOpen(_open)}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => setIsOpen((prevState) => !prevState)}
          variant="ghost"
          size="icon"
        >
          <Pencil2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Profile Image</AlertDialogTitle>
        </AlertDialogHeader>
        <AutoForm
          onSubmit={(data) => updateName(data)}
          values={{
            name: name,
          }}
          formSchema={z.object({
            name: z
              .string({
                required_error: "Name is required",
              })
              .max(25, "Maximum 25 Characters")
              .min(1, "Required"),
          })}
        >
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <AutoFormSubmit disabled={isPending}>Update Name</AutoFormSubmit>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AutoForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
