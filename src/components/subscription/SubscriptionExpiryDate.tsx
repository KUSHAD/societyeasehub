import { getUserSubscriptionPlan } from "~/actions/getUserSubscription";
import { CardDescription } from "../ui/card";
import { format } from "date-fns";
import ClientOnly from "../ClientOnly";
import ShowBillingButton from "./ShowBillingButton";

export default async function SubscriptionExpiryDate() {
  const subscription = await getUserSubscriptionPlan();
  return (
    <>
      <CardDescription>
        Your Subscription ends on
        {format(subscription.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}{" "}
      </CardDescription>
      <ClientOnly>
        <ShowBillingButton />
      </ClientOnly>
    </>
  );
}
