import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { canManageAccounts } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import FinanceDrawer from "~/components/navbar/society/finance/FinanceDrawer";
import FinanceMobileNav from "~/components/navbar/society/finance/FinanceMobileNav";
import { ScrollArea } from "~/components/ui/scroll-area";

export default async function FinancePermsLayout({
  children,
  params: { societyId },
}: {
  children: ReactNode;
  params: { societyId: string };
}) {
  const canManage = await canManageAccounts(societyId);

  if (!canManage) redirect(`/society/${societyId}/finance`);

  return (
    <div className="flex flex-row">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 -ml-2 hidden w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pl-8 pr-6 lg:py-8">
            <FinanceDrawer />
          </ScrollArea>
        </aside>
        <div className="flex flex-col">
          <div className="block md:hidden">
            <ClientOnly>
              <FinanceMobileNav />
            </ClientOnly>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
