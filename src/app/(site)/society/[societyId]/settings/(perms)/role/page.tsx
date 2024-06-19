import { redirect } from "next/navigation";
import { canAccessSettings } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import AddRole from "~/components/society/settings/role/AddRole";
import ViewRoles from "~/components/society/settings/role/ViewRoles";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { societyId } }: PageProps) {
  const canAccess = await canAccessSettings(societyId);

  if (!canAccess) redirect(`/society/${societyId}/settings`);
  return (
    <>
      <div className="flex flex-row">
        <div className="mr-auto" />
        <ClientOnly>
          <AddRole />
        </ClientOnly>
      </div>
      <hr className="my-2" />
      <ClientOnly>
        <ViewRoles />
      </ClientOnly>
    </>
  );
}
