"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
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
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { PasswordInput } from "~/components/ui/password-input";
import { toast } from "~/components/ui/use-toast";
import { changePasswordSchema } from "~/lib/validators/changePassword";
import { api } from "~/trpc/react";

export default function ChangePasswordForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { societyId } = useParams<{ societyId: string }>();
  const { mutate: changePassword, isLoading } =
    api.society.changePassword.useMutation({
      onSuccess() {
        toast({ title: "Success", description: "Password Updated" });
        setIsOpen(false);
      },
    });
  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Change Password</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Password</AlertDialogTitle>
          <AlertDialogDescription>
            Change Society Password Required For Sensitive Actions. Your
            previous passwords will not work after the update
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AutoForm
          formSchema={changePasswordSchema}
          onSubmit={(data) =>
            changePassword({
              ...data,
              societyId,
            })
          }
          fieldConfig={{
            currentPassword: {
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
            newPassword: {
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
            confirmNewPassword: {
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
        >
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <AutoFormSubmit disabled={isLoading}>
                {isLoading ? "Updating ..." : "Update Password"}
              </AutoFormSubmit>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AutoForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
