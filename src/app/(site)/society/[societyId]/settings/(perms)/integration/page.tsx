import ClientOnly from "~/components/ClientOnly";
import APIKeyChooser from "~/components/society/settings/integration/APIKeyChooser";

export default function Page() {
  return (
    <ClientOnly>
      <APIKeyChooser />
    </ClientOnly>
  );
}
