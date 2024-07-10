"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import NotFound from "~/components/NotFound";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function NotAllowedRoles() {
  const { channelId, societyId } = useParams<{
    channelId: string;
    societyId: string;
  }>();

  const utils = api.useUtils();

  const { data, isPending } = api.channelAccessRole.getNoAccessRoles.useQuery({
    channelId,
    societyId,
  });

  const { mutate: create, isPending: updating } =
    api.channelAccessRole.create.useMutation({
      async onSuccess() {
        await utils.channelAccessRole.getAccessRoles.invalidate({
          societyId,
          channelId,
        });
        await utils.channelAccessRole.getNoAccessRoles.invalidate({
          societyId,
          channelId,
        });

        toast({
          title: "Message",
          description: "Access Updated",
        });
      },
    });

  return isPending ? (
    <Skeleton className="my-2 h-16 w-full" count={5} />
  ) : data && data.length === 0 ? (
    <NotFound
      message="No Roles"
      description="Either all roles have access to this channel or you have no roles created"
    />
  ) : (
    data?.map((_role) => (
      <div key={_role.id} className="my-2 w-full rounded bg-accent shadow-md">
        <div className="mx-4 flex flex-row justify-between py-2">
          <em>{_role.name}</em>
          <Button
            disabled={updating}
            onClick={() =>
              create({
                channelId,
                societyId,
                roleId: _role.id,
              })
            }
          >
            Allow
          </Button>
        </div>
      </div>
    ))
  );
}
