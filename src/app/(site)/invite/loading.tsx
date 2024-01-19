import Skeleton from "react-loading-skeleton";

export default function Loading() {
  return <Skeleton className="my-2 h-[75px] w-full" count={10} />;
}
