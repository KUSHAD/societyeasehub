import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function loading() {
  return (
    <>
      <div className="my-2 flex flex-row">
        <div className="mr-auto" />
        <Skeleton className="mx-2 h-[40px] w-[100px]" />
        <Skeleton className="mx-2 h-[40px] w-[100px]" />
      </div>
      <Skeleton className="mb-2 h-[40px] w-full" />
      <Card className="my-2">
        <CardHeader>
          <CardTitle>Transaction Splits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Skeleton className="h-[300px] w-[300px] rounded-full" />
          </div>
        </CardContent>
      </Card>
      <Card className="my-2">
        <CardHeader>
          <CardTitle>Daily Splits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
      <Card className="my-2">
        <CardHeader>
          <CardTitle>Transaction Data Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </>
  );
}
