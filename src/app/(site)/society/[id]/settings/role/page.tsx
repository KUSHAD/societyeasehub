import ClientOnly from "~/components/ClientOnly";
import AddRole from "~/components/society/settings/role/AddRole";

export default function Page() {
  return (
    <>
      <div className="flex flex-row">
        <div className="mr-auto" />
        <ClientOnly>
          <AddRole />
        </ClientOnly>
      </div>
    </>
  );
}
