import React from "react";
import ClientOnly from "~/components/ClientOnly";
import SocietyTabs from "~/components/navbar/society";
import BackBar from "~/components/navbar/society/BackBar";

export default function SocietyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <ClientOnly>
        <BackBar />
      </ClientOnly>
      <div className="my-2">
        <SocietyTabs />
      </div>
      {children}
    </div>
  );
}
