import { canCreateInvites } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import Members from "~/components/society/members/Members";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canCreate = await canCreateInvites(id);
  return (
    <>
      <div className="flex flex-row">
        <div className="mr-auto" />
        {canCreate ? "I can access" : <div className=" h-5" />}
      </div>
      <hr />
      <ClientOnly>
        <Members />
      </ClientOnly>
    </>
  );
}
