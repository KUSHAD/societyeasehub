import ClientOnly from "~/components/ClientOnly";
import Invites from "~/components/invite/Invites";

export const revalidate = 0;

export default function Page() {
  return (
    <ClientOnly>
      <Invites />
    </ClientOnly>
  );
}
