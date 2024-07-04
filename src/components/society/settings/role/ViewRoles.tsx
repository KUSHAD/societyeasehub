"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { api } from "~/trpc/react";
import RoleViewer from "./RoleViewer";
import NotFound from "~/components/NotFound";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import { toast } from "~/components/ui/use-toast";

export default function ViewRoles() {
  const { societyId } = useParams<{ societyId: string }>();
  const [autoRoleValue, setAutoRoleValue] = useState("");

  const utils = api.useUtils();

  const { isLoading, data: roles } = api.role.getBySociety.useQuery({
    societyId,
  });

  const { isLoading: gettingAutoRole } = api.role.getAutoRole.useQuery(
    {
      societyId,
    },
    {
      onSuccess: (data) => setAutoRoleValue(data ?? ""),
    },
  );

  const { isLoading: updating, mutate: assign } =
    api.role.assignAutoRole.useMutation({
      async onSuccess() {
        await utils.role.getAutoRole.invalidate({ societyId });

        toast({ title: "Message", description: "Auto role updated" });
      },
    });

  return isLoading ? (
    <Skeleton className="my-2 h-12 w-full" count={10} />
  ) : roles && roles.length !== 0 ? (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Auto Assign Role</CardTitle>
          <CardDescription>
            A role that would be assigned to members automatically upon joining
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            disabled={gettingAutoRole || updating}
            value={autoRoleValue ?? ""}
            onValueChange={(value) => setAutoRoleValue(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((_role) => (
                <SelectItem value={_role.id}>{_role.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex flex-row">
          <div className="mr-auto" />
          <Button
            onClick={() =>
              assign({
                roleId: autoRoleValue,
                societyId,
              })
            }
            disabled={!autoRoleValue || gettingAutoRole || updating}
          >
            Assign
          </Button>
        </CardFooter>
      </Card>
      {roles.map((_role) => (
        <RoleViewer role={_role} key={_role.id} />
      ))}
    </>
  ) : (
    <NotFound
      message="You have not created any roles"
      description="Create a role with different access levels and assign it to users in
        members page"
    />
  );
}
