"use client";

import { newSocietyValidationSchema } from "~/lib/validators/newSociety";
import AutoForm, { AutoFormSubmit } from "../ui/auto-form";
import { api } from "~/trpc/react";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSocietyForm() {
  const [showPass, setShowPass] = useState(false);
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
