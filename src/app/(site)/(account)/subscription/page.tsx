import { format } from "date-fns";
import {
  getUserSubscription,
  syncStripeDataToDB,
} from "~/actions/subscription";
import ClientOnly from "~/components/ClientOnly";
import BillingPortalButton from "~/components/subscription/BillingPortalButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Page() {
  const subscription = await getUserSubscription();

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>View your Subscription</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          You currently have no subscription. Kindly proceed to payment.
        </CardContent>
        <CardFooter>
          <ClientOnly>
            <BillingPortalButton />
          </ClientOnly>
        </CardFooter>
      </Card>
    );
  }

  await syncStripeDataToDB(subscription.stripeCustomerId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>View your Subscription</CardDescription>
      </CardHeader>
      <CardContent>
        Your Subscription Ends on{" "}
        {format(
          new Date((subscription.stripeCurrentPeriodEnd ?? 0) * 1000),
          "dd/MM/yyyy",
        )}
      </CardContent>
      <CardFooter>
        <ClientOnly>
          <BillingPortalButton />
        </ClientOnly>
      </CardFooter>
    </Card>
  );
}
