import ClientOnly from "~/components/ClientOnly";
import Invites from "~/components/invite/Invites";

export default function Page() {
  return (
    <ClientOnly>
      <Invites />
    </ClientOnly>
  );
}
