"use client";

import { useParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { type AutoFormInputComponentProps } from "~/components/ui/auto-form/types";
import { Button } from "~/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form";
import { PasswordInput } from "~/components/ui/password-input";
import { deleteSocietySchema } from "~/lib/validators/deleteSociety";
import { api } from "~/trpc/react";

export default function DeleteSocietyForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const utils = api.useUtils();

  const { mutate: deleteSociety, isLoading } = api.society.delete.useMutation({
    onSuccess: async () => {
      await utils.society.getUserMemberships.invalidate();

      router.push("/dashboard");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Society</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Society</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes all the resources related to this society also.This
            action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AutoForm
          onSubmit={(data) =>
            deleteSociety({
              ...data,
              societyId: id,
            })
          }
          fieldConfig={{
            password: {
              description:
                "This is a sensitive action so it requires the password which you set for this society",
              fieldType: ({
                label,
                isRequired,
                field,
                fieldConfigItem,
              }: AutoFormInputComponentProps) => (
                <FormItem>
                  <FormLabel>
                    {label}
                    {isRequired && <span className="text-destructive">*</span>}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  {fieldConfigItem.description && (
                    <FormDescription>
                      {fieldConfigItem.description}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              ),
            },
          }}
          formSchema={deleteSocietySchema}
        >
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AutoFormSubmit disabled={isLoading}>Delete</AutoFormSubmit>
          </AlertDialogFooter>
        </AutoForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
