import React from "react";
import ClientOnly from "~/components/ClientOnly";
import Navbar from "~/components/navbar/site";
import Tab from "~/components/navbar/site/Tab";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <main className="mt-4 px-2">{children}</main>
      </div>
      <ClientOnly>
        <Tab />
      </ClientOnly>
    </>
  );
}
