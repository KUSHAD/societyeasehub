import { redirect } from "next/navigation";
import { isSocietyOwner } from "~/actions/checkUserRole";
import { getCurrentUser } from "~/actions/getCurrentUser";
import ChangePasswordCard from "~/components/society/settings/danger/ChangePasswordCard";
import DeleteSocietyCard from "~/components/society/settings/danger/DeleteSocietyCard";
import TransferOwnershipCard from "~/components/society/settings/danger/TransferOwnershipCard";
import { type PageProps } from "~/lib/types";

export const dynamic = "force-dynamic";

export default async function Page({ params: { id } }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/api/auth/signin");

  const isOwner = await isSocietyOwner(id, currentUser.id);

  if (!isOwner) redirect(`/society/${id}/settings`);
  return (
    <>
      <ChangePasswordCard />
      <TransferOwnershipCard />
      <DeleteSocietyCard />
    </>
  );
}
