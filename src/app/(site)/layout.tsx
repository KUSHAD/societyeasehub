import React from "react";
import { getUserSubscription } from "~/actions/subscription";
import ClientOnly from "~/components/ClientOnly";
import PaymentModal from "~/components/PaymentModal";
import Navbar from "~/components/navbar/site";
import Tab from "~/components/navbar/site/Tab";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const subscription = await getUserSubscription();
  return subscription && subscription.isActive ? (
    <>
      <Navbar />
      <div className="min-h-screen">
        <main className="mt-4 px-2">{children}</main>
      </div>
      <ClientOnly>
        <Tab />
      </ClientOnly>
    </>
  ) : (
    <ClientOnly>
      <PaymentModal />
    </ClientOnly>
  );
}
