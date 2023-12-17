import ClientOnly from "../../ClientOnly";
import ProfileMenu from "./ProfileMenu";
import { getCurrentUser } from "~/actions/getCurrentUser";

export default async function ProfileContent() {
  const currentUser = await getCurrentUser();
  return (
    <ClientOnly>
      <ProfileMenu currentUser={currentUser} />
    </ClientOnly>
  );
}
