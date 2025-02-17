import { redirect } from "next/navigation";
import React from "react";
import { checkIsSocietyMember } from "~/actions/checkIsSocietyMember";
import ClientOnly from "~/components/ClientOnly";
import ShareModal from "~/components/ShareModal";
import SocietyTabs from "~/components/navbar/society";
import BackBar from "~/components/navbar/society/BackBar";

export default async function SocietyLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ societyId: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

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
      <ClientOnly>
        <ShareModal />
      </ClientOnly>
      {children}
    </div>
  );
}
