import { OverviewDataCardLoading } from "~/components/society/finance/overview/OverviewDataCard";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2">
        <OverviewDataCardLoading />
        <OverviewDataCardLoading />
        <OverviewDataCardLoading />
      </div>
      <div className="flex flex-col">
        <div className="my-2">
          <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
              <CardTitle className="line-clamp-1 text-xl">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
          <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2">
            <Card className="border-none drop-shadow-sm">
              <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
                <CardTitle className="line-clamp-1 text-xl">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
            <Card className="border-none drop-shadow-sm">
              <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
                <CardTitle className="line-clamp-1 text-xl">Payees</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
