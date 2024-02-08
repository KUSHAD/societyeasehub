import { Suspense } from "react";
import SubscriptionExpiryDate from "~/components/subscription/SubscriptionExpiryDate";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-[14px] w-full rounded" />}>
          <SubscriptionExpiryDate />
        </Suspense>
      </CardContent>
    </Card>
  );
}
