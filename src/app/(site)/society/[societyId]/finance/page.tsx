import { redirect } from "next/navigation";
import { canManageAccounts } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import OverviewDataCharts from "~/components/society/finance/overview/OverviewDataCharts";
import OverviewDataGrid from "~/components/society/finance/overview/OverviewDataGrid";
import FinanceFilters from "~/components/society/finance/overview/filters/FinanceFilters";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { societyId } }: PageProps) {
  const canManage = await canManageAccounts(societyId);

  if (canManage) redirect(`/society/${societyId}/finance/overview`);

  return (
    <ClientOnly>
      <div className="my-2">
        <FinanceFilters />
      </div>
      <div className="mx-auto w-full max-w-screen-2xl pb-10">
        <OverviewDataGrid />
        <OverviewDataCharts />
      </div>
    </ClientOnly>
  );
}
