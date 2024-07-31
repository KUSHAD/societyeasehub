import { redirect } from "next/navigation";
import { isSocietyOwner } from "~/actions/checkUserRole";
import { getCurrentUser } from "~/actions/getCurrentUser";
import ClientOnly from "~/components/ClientOnly";
import APIKeyChooser from "~/components/society/settings/integration/APIKeyChooser";
import RevokeAPIKey from "~/components/society/settings/integration/RevokeAPIKey";
import SocietyIntegrationPerms from "~/components/society/settings/integration/SocietyIntegrationPerms";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { societyId } }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/api/auth/signin");

  const isOwner = await isSocietyOwner(societyId, currentUser.id);

  if (!isOwner) redirect(`/society/${societyId}/settings`);
  return (
    <ClientOnly>
      <APIKeyChooser />
      <SocietyIntegrationPerms />
      <RevokeAPIKey />
    </ClientOnly>
  );
}
