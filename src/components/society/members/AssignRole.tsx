"use client";

import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

interface AssignRoleProps {
  userId: string;
}

export default function AssignRole({ userId }: AssignRoleProps) {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { data: roles, isLoading } = api.role.getBySociety.useQuery({
    societyId,
  });

  const { data: roleId, isLoading: gettingRole } = api.member.getRole.useQuery({
    societyId,
    userId,
  });

  const { mutate: assignRole, isLoading: assigningRole } =
    api.member.assignRole.useMutation({
      onSuccess: async () => {
        await utils.member.getBySociety.invalidate();
        toast({
          title: "Success",
          description: "Role Updated",
        });
      },
    });
  return isLoading || gettingRole ? (
    <DropdownMenuItem disabled>
      <RefreshCcw className="mx-2 animate-spin" /> Fetching Roles
    </DropdownMenuItem>
  ) : roles && roles.length !== 0 ? (
    <DropdownMenuRadioGroup
      value={roleId ?? (null as unknown as string | undefined)}
      defaultValue={roleId ?? (null as unknown as string | undefined)}
      onValueChange={(roleId) =>
        assignRole({
          roleId,
          societyId,
          userId,
        })
      }
    >
      <DropdownMenuRadioItem disabled={assigningRole} value={""}>
        No Role
      </DropdownMenuRadioItem>
      {roles.map((_role) => (
        <DropdownMenuRadioItem disabled={assigningRole} value={_role.id}>
          {_role.name}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  ) : (
    <DropdownMenuItem disabled>No Roles </DropdownMenuItem>
  );
}
