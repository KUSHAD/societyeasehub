import ClientOnly from "~/components/ClientOnly";
import UserMemberships from "~/components/home/UserMemberships";

export default function Page() {
  return (
    <ClientOnly>
      <UserMemberships />
    </ClientOnly>
  );
}
