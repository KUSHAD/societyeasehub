import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { canManageAccounts } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import FinanceFilters from "~/components/society/finance/overview/filters/FinanceFilters";

export default async function FinanceWithFiltersLayout(
  props: {
    children: ReactNode;
    params: Promise<{ societyId: string }>;
  }
) {
  const params = await props.params;

  const {
    societyId
  } = params;

  const {
    children
  } = props;

  const canManage = await canManageAccounts(societyId);

  if (!canManage) redirect(`/society/${societyId}/finance`);

  return (
    <>
      <div className="my-2">
        <ClientOnly>
          <FinanceFilters />
        </ClientOnly>
      </div>
      {children}
    </>
  );
}
