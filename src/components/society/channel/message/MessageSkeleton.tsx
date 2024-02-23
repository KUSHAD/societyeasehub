import { Skeleton } from "~/components/ui/skeleton";

export default function MessageSkeleton() {
  return (
    <>
      <OtherMessageSkeleton />
      <SelfMessageSkeleton />
      <OtherMessageSkeleton />
      <SelfMessageSkeleton />
    </>
  );
}

function OtherMessageSkeleton() {
  return (
    <>
      <div className="flex flex-row">
        <Skeleton className="mr-2 h-[45px] w-[45px] rounded-full" />
        <Skeleton className="my-3 h-5 w-4/12" />
      </div>
      <div className="my-2 flex w-1/2 flex-col rounded-lg bg-muted">
        <div className="px-2 py-2">
          <Skeleton className="my-2 h-5 w-full" />
          <Skeleton className="mb-2 h-5 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </>
  );
}

function SelfMessageSkeleton() {
  return (
    <div className="flex flex-row">
      <div className="mr-auto" />
      <div className="my-2 flex w-1/2 flex-col rounded-lg bg-primary/40">
        <div className="px-2 py-2">
          <Skeleton className="my-2 h-5 w-full" />
          <Skeleton className="mb-2 h-5 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </div>
  );
}
