import { canManageAccounts } from "~/actions/checkUserRole";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canManage = await canManageAccounts(id);
  return (
    <>
      {canManage ? "u can manage" : null}
      "account"
    </>
  );
}
