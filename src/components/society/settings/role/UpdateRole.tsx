"use client";

import Skeleton from "react-loading-skeleton";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { toast } from "~/components/ui/use-toast";
import { newRole } from "~/lib/validators/newRole";
import { api } from "~/trpc/react";

export default function UpdateRole({ id }: { id: string }) {
  const utils = api.useUtils();
  const { data: role, isLoading } = api.role.getByID.useQuery({ id }, {});

  const { isLoading: updating, mutate: update } = api.role.update.useMutation({
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
      fieldConfig={{
        name: { description: "Name of the role" },
        accessSettings: {
          fieldType: "switch",
          description: "Access Settings Page",
        },
        createInvite: {
          fieldType: "switch",
          description: "Can create Invites",
        },
        assignRole: {
          fieldType: "switch",
          description: "Assign Role to Members",
        },
        kickUser: {
          fieldType: "switch",
          description: "Remove users from society",
        },
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
