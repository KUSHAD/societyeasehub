import { canManageAccounts } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import AddTransactionForm from "~/components/society/accounts/AddTransactionForm";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canManage = await canManageAccounts(id);
  return (
    <>
      {canManage ? (
        <ClientOnly>
          <AddTransactionForm />
        </ClientOnly>
      ) : null}
    </>
  );
}
