"use client";

import { newSocietyValidationSchema } from "~/lib/validators/newSociety";
import AutoForm, { AutoFormSubmit } from "../ui/auto-form";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { type AutoFormInputComponentProps } from "../ui/auto-form/types";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../ui/password-input";

export default function NewSocietyForm() {
  const router = useRouter();
  const utils = api.useUtils();
  const { isLoading, mutate: create } = api.society.create.useMutation({
    onSuccess: async (data) => {
      await utils.society.getUserMemberships.invalidate();
      router.push(`/society/${data.id}`);
    },
  });
  return (
    <AutoForm
      onSubmit={(data) => create(data)}
      formSchema={newSocietyValidationSchema}
      fieldConfig={{
        zipCode: {
          fieldType: "number",
        },
        password: {
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
        confirmPassword: {
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
      <AutoFormSubmit className="w-full" disabled={isLoading} />
    </AutoForm>
  );
}
