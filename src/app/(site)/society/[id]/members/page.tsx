import { canCreateInvites } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import CreateInvite from "~/components/society/members/invite/CreateInvite";
import Members from "~/components/society/members/Members";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canCreate = await canCreateInvites(id);
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
        <Members />
      </ClientOnly>
    </>
  );
}
