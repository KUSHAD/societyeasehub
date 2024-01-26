import { redirect } from "next/navigation";
import { canCreateRoles } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import AddRole from "~/components/society/settings/role/AddRole";
import ViewRoles from "~/components/society/settings/role/ViewRoles";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canAccess = await canCreateRoles(id);

  if (!canAccess) redirect(`/society/${id}/feed`);
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
