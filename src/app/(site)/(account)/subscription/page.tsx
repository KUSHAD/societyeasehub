import { format } from "date-fns";
import { getUserSubscription } from "~/actions/subscription";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>View your Subscription</CardDescription>
      </CardHeader>
      <CardContent>
        Your Subscription Ends on{" "}
        {format(subscription!.stripeCurrentPeriodEnd, "dd/MM/yyyy")}
      </CardContent>
      <CardFooter>
        <ClientOnly>
          <BillingPortalButton />
        </ClientOnly>
      </CardFooter>
    </Card>
  );
}
