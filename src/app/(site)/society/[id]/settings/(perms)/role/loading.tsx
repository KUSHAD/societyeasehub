import Skeleton from "react-loading-skeleton";

export default function Loading() {
  return <Skeleton className="my-2 h-12 w-full" count={10} />;
}
