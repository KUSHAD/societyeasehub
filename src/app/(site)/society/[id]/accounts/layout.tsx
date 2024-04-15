import React from "react";
import ClientOnly from "~/components/ClientOnly";
import AccountsDrawer from "~/components/navbar/society/accounts/AccountsDrawer";
import AccountsMobileNav from "~/components/navbar/society/accounts/AccountsMobileNav";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function SocietyAccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pl-8 pr-6 lg:py-8">
            <ClientOnly>
              <AccountsDrawer />
            </ClientOnly>
          </ScrollArea>
        </aside>
        <div className="flex flex-col">
          <div className="block md:hidden">
            <ClientOnly>
              <AccountsMobileNav />
            </ClientOnly>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
