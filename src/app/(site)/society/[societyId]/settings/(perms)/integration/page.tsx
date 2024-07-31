import ClientOnly from "~/components/ClientOnly";
import APIKeyChooser from "~/components/society/settings/integration/APIKeyChooser";
import SocietyIntegrationPerms from "~/components/society/settings/integration/SocietyIntegrationPerms";

export default function Page() {
  return (
    <ClientOnly>
      <APIKeyChooser />
      <SocietyIntegrationPerms />
    </ClientOnly>
  );
}
