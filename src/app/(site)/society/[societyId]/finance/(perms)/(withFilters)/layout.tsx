import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { canManageAccounts } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import FinanceFilters from "~/components/society/finance/overview/filters/FinanceFilters";

export default async function FinanceWithFiltersLayout({
  children,
  params: { societyId },
}: {
  children: ReactNode;
  params: { societyId: string };
}) {
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
