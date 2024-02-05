"use client";

import { useParams, useRouter } from "next/navigation";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { type AutoFormInputComponentProps } from "~/components/ui/auto-form/types";
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
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { mutate: changePassword, isLoading } =
    api.society.changePassword.useMutation({
      onSuccess() {
        toast({ title: "Success", description: "Password Updated" });
        router.refresh();
      },
    });
  return (
    <AutoForm
      formSchema={changePasswordSchema}
      onSubmit={(data) =>
        changePassword({
          ...data,
          societyId: id,
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
              <div>
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
              </div>
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
              <div>
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
              </div>
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
              <div>
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
              </div>
            </FormItem>
          ),
        },
      }}
    >
      <AutoFormSubmit disabled={isLoading}>
        {isLoading ? "Updating ..." : "Update Password"}
      </AutoFormSubmit>
    </AutoForm>
  );
}
