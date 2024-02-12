import Skeleton from "react-loading-skeleton";

export default function Loading() {
  return <Skeleton className="my-2 h-[40px] w-full" count={3} />;
}
