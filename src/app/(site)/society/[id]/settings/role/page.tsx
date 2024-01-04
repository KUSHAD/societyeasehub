import ClientOnly from "~/components/ClientOnly";
import AddRole from "~/components/society/settings/role/AddRole";
import ViewRoles from "~/components/society/settings/role/ViewRoles";

export default function Page() {
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
