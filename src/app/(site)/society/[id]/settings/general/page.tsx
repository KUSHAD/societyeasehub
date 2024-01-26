import { redirect } from "next/navigation";
import { canAccessGeneral } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import SocietyMedias from "~/components/society/settings/general/SocietyMedias";
import UpdateDetails from "~/components/society/settings/general/UpdateDetails";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canAccess = await canAccessGeneral(id);

  if (!canAccess) redirect(`/society/${id}/feed`);
  return (
    <div className="px-4 py-2">
      <ClientOnly>
        <UpdateDetails />
        <SocietyMedias />
      </ClientOnly>
    </div>
  );
}
