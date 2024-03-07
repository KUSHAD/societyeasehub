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
        Your Subscription Customer Id{" "}
        <strong>{subscription.stripeCustomerId}</strong>
      </CardDescription>
      <CardDescription>
        Your Subscription Id{" "}
        <strong>{subscription.stripeSubscriptionId} </strong>
      </CardDescription>
      <CardDescription>
        Your Subscription ends on{" "}
        <strong>
          {format(subscription.stripeCurrentPeriodEnd!, "dd MMM yyyy")}
        </strong>
      </CardDescription>
      <ClientOnly>
        <ShowBillingButton />
      </ClientOnly>
    </>
  );
}
