import { redirect } from "next/navigation";
import { canManageAccounts } from "~/actions/checkUserRole";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { societyId } }: PageProps) {
  const canManage = await canManageAccounts(societyId);

  if (canManage) redirect(`/society/${societyId}/finance/overview`);

  return <div>Accounts</div>;
}
