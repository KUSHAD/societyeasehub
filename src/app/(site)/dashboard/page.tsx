import ClientOnly from "~/components/ClientOnly";
import UserMemberships from "~/components/dashboard/UserMemberships";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ClientOnly>
      <UserMemberships />
    </ClientOnly>
  );
}
