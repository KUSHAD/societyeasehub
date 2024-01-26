import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="h-full max-h-full w-full max-w-full">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
