import { canManageAccounts } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import AddTransactionForm from "~/components/society/accounts/AddTransactionForm";
import PieChartData from "~/components/society/accounts/PieChartData";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canManage = await canManageAccounts(id);
  return (
    <>
      {canManage ? (
        <ClientOnly>
          <div className="my-2">
            <AddTransactionForm />
          </div>
        </ClientOnly>
      ) : null}
      <ClientOnly>
        <PieChartData />
      </ClientOnly>
    </>
  );
}
