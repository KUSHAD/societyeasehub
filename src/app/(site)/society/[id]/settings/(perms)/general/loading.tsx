import Skeleton from "react-loading-skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

export default function Loading() {
  return (
    <Card className="my-2">
      <CardHeader className="flex flex-row">
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="my-1 h-5 w-full" count={7} />
      </CardContent>
    </Card>
  );
}
