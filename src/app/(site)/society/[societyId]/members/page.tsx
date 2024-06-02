import {
  canAssignRoles,
  canCreateInvites,
  canKickMember,
} from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import CreateInvite from "~/components/society/members/invite/CreateInvite";
import Members from "~/components/society/members/Members";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { societyId } }: PageProps) {
  const canCreate = await canCreateInvites(societyId);
  const canKick = await canKickMember(societyId);
  const assignRole = await canAssignRoles(societyId);
  return (
    <>
      <div className="flex flex-row">
        <div className="mr-auto" />
        {canCreate ? (
          <ClientOnly>
            <CreateInvite />
          </ClientOnly>
        ) : (
          <div className="h-5" />
        )}
      </div>
      <hr className="my-2" />
      <ClientOnly>
        <Members canAssignRoles={assignRole} canKick={canKick} />
      </ClientOnly>
    </>
  );
}
