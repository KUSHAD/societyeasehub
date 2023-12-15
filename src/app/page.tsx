import ClientOnly from "~/components/ClientOnly";
import UserMemberships from "~/components/home/UserMemberships";

export default async function Home() {
  return (
    <ClientOnly>
      <UserMemberships />
    </ClientOnly>
  );
}
