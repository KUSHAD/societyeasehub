import ClientOnly from "~/components/ClientOnly";
import UserMemberships from "~/components/dashboard/UserMemberships";

export default function Page() {
  return (
    <ClientOnly>
      <UserMemberships />
    </ClientOnly>
  );
}
