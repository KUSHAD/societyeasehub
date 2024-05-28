import { redirect } from "next/navigation";
import { canAccessSettings } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import ExitSociety from "~/components/society/ExitSociety";
import { type PageProps } from "~/lib/types";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Page({ params: { id } }: PageProps) {
  const canAccess = await canAccessSettings(id);

  if (canAccess) redirect(`/society/${id}/settings/general`);
  return (
    <ClientOnly>
      <ExitSociety />
    </ClientOnly>
  );
}
