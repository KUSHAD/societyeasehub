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
        <Suspense
          fallback={
            <div className="flex flex-col">
              <Skeleton className="my-1 h-[14px] w-full rounded" />
              <Skeleton className="my-1 h-[14px] w-full rounded" />
              <Skeleton className="my-1 h-[14px] w-full rounded" />
            </div>
          }
        >
          <SubscriptionExpiryDate />
        </Suspense>
      </CardContent>
    </Card>
  );
}
