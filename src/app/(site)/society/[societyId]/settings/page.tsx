import { redirect } from "next/navigation";
import { canAccessSettings } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import ExitSociety from "~/components/society/ExitSociety";
import { type PageProps } from "~/lib/types";

export default async function Page(props: PageProps) {
  const params = await props.params;

  const {
    societyId
  } = params;

  const canAccess = await canAccessSettings(societyId);

  if (canAccess) redirect(`/society/${societyId}/settings/general`);
  return (
    <ClientOnly>
      <ExitSociety />
    </ClientOnly>
  );
}
