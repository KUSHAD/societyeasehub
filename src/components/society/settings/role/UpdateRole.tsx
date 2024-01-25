"use client";

import Skeleton from "react-loading-skeleton";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { toast } from "~/components/ui/use-toast";
import { newRole } from "~/lib/validators/newRole";
import { api } from "~/trpc/react";

export default function UpdateRole({ id }: { id: string }) {
  const utils = api.useUtils();
  const { data: role, isLoading } = api.role.getByID.useQuery(
    { id },
    {
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },

      retryDelay: 500,
    },
  );

  const { isLoading: updating, mutate: update } = api.role.update.useMutation({
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

    onSuccess: async () => {
      await utils.role.invalidate();
      toast({
        title: "Message",
        description: "Role Updated",
      });
    },

    retryDelay: 500,
  });
  return isLoading ? (
    <Skeleton count={5} className="my-4 h-6" />
  ) : (
    <AutoForm
      onSubmit={(data) => {
        update({
          ...data,
          id,
        });
      }}
      formSchema={newRole}
      values={role}
    >
      <AutoFormSubmit disabled={updating || isLoading} className="w-full">
        Update
      </AutoFormSubmit>
    </AutoForm>
  );
}
