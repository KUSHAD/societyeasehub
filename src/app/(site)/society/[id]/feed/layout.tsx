import React from "react";
import ClientOnly from "~/components/ClientOnly";
import FeedDrawer from "~/components/navbar/society/FeedDrawer";
import FeedMobileNav from "~/components/navbar/society/FeedMobileNav";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function SocietyFeedLayout({
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
              <FeedDrawer />
            </ClientOnly>
          </ScrollArea>
        </aside>
        <div className="flex flex-col">
          <div className="block md:hidden">
            <ClientOnly>
              <FeedMobileNav />
            </ClientOnly>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
