"use client";

import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

interface DeleteRoleProps {
  roleId: string;
}

export default function DeleteRole({ roleId }: DeleteRoleProps) {
  const utils = api.useUtils();

  const { mutate: deleteRole, isPending } = api.role.delete.useMutation({
    onSuccess: async () => {
      await utils.role.getBySociety.invalidate();

      toast({
        title: "Success",
        description: "Role Deleted",
      });
    },
  });
  return (
    <>
      Are you sure you want delete this role ? Make sure to assign all your
      users different roles before deleting this role
      <Button
        disabled={isPending}
        onClick={() => deleteRole({ id: roleId })}
        className="my-2 w-full"
        variant="destructive"
      >
        Delete
      </Button>
    </>
  );
}
