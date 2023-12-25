"use client";

import { editSocietyValidationSchema } from "~/lib/validators/editSociety";
import AutoForm, { AutoFormSubmit } from "../ui/auto-form";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "../ui/use-toast";

export default function UpdateDetails() {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const { mutate: updateDetails, isLoading: updating } =
    api.society.updateDetails.useMutation({
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      onSuccess: async () => {
        toast({
          title: "Message",
          description: "Details Updated Successfully",
        });
        await utils.society.getInfo.invalidate();
      },
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },
      retryDelay: 500,
    });
  const { data: societyDetails, isLoading } = api.society.getInfo.useQuery(
    {
      id,
    },
    {
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
      retryDelay: 500,
    },
  );

  return isLoading
    ? "Getting details"
    : societyDetails && (
        <AutoForm
          onSubmit={(data) =>
            updateDetails({
              ...data,
              id,
            })
          }
          values={{
            ...societyDetails,
            addressLine2: societyDetails.addressLine2 ?? "",
            country: societyDetails.country,
          }}
          formSchema={editSocietyValidationSchema}
          fieldConfig={{
            zipCode: {
              fieldType: "number",
            },
          }}
        >
          <AutoFormSubmit disabled={updating} className="w-full" />
        </AutoForm>
      );
}
