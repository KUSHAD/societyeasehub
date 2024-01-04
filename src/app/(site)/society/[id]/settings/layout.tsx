import React from "react";
import ClientOnly from "~/components/ClientOnly";
import SettingsDrawer from "~/components/navbar/society/SettingsDrawer";
import SettingsMobileNav from "~/components/navbar/society/SettingsMobileNav";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pl-8 pr-6 lg:py-8">
            <SettingsDrawer />
          </ScrollArea>
        </aside>
        <div className="flex flex-col">
          <div className="block md:hidden">
            <ClientOnly>
              <SettingsMobileNav />
            </ClientOnly>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
