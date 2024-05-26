import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>View your Subscription</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row">
        Your Subscription Ends on{" "}
        <Skeleton className="my-1 ml-2 h-4 w-[100px]" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled>
          Go to Billing Portal
        </Button>
      </CardFooter>
    </Card>
  );
}
