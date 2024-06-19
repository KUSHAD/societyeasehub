import { redirect } from "next/navigation";
import React from "react";
import { checkIsSocietyMember } from "~/actions/checkIsSocietyMember";
import ClientOnly from "~/components/ClientOnly";
import SocietyTabs from "~/components/navbar/society";
import BackBar from "~/components/navbar/society/BackBar";

export default async function SocietyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { societyId: string };
}) {
  const societyExists = await checkIsSocietyMember(params.societyId);

  if (!societyExists) redirect("/dashboard");

  return (
    <div className="flex flex-col overflow-hidden">
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
