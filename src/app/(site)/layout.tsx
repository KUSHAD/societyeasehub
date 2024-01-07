import React from "react";
import { getUserSubscriptionPlan } from "~/actions/getUserSubscription";
import ClientOnly from "~/components/ClientOnly";
import PaymentModal from "~/components/PaymentModal";
import Navbar from "~/components/navbar/site";
import Tab from "~/components/navbar/site/Tab";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const subscription = await getUserSubscriptionPlan();

  return (
    <>
      <Navbar />
      {subscription.isSubscribed && !subscription.isCanceled ? (
        <>
          <div className="min-h-screen">
            <main className="mt-4 px-2">{children}</main>
          </div>
        </>
      ) : (
        <ClientOnly>
          <PaymentModal />
        </ClientOnly>
      )}
      <ClientOnly>
        <Tab />
      </ClientOnly>
    </>
  );
}
