"use client";

import { newSocietyValidationSchema } from "~/lib/validators/newSociety";
import AutoForm, { AutoFormSubmit } from "../ui/auto-form";
import { api } from "~/trpc/react";
import { toast } from "../ui/use-toast";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSocietyForm() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const { isLoading, mutate: create } = api.society.create.useMutation({
    onSuccess(data) {
      router.push(`/society/${data.id}`);
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    retry(failureCount) {
      if (failureCount > 3) return true;

      return false;
    },
    retryDelay: 500,
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
          description:
            "This password will be used when performing sensitive actions",
          inputProps: {
            type: showPass ? "text" : "password",
          },
        },
      }}
    >
      <div className="flex flex-row">
        <Checkbox
          checked={showPass}
          onClick={() => setShowPass((_prevState) => !_prevState)}
          className="mx-2 my-1"
        />
        {showPass ? "Hide Password" : "Show Password"}
      </div>
      <AutoFormSubmit className="w-full" disabled={isLoading} />
    </AutoForm>
  );
}
