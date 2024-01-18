import Skeleton from "react-loading-skeleton";

export default function Loading() {
  return <Skeleton height={75} className="my-2" count={10} />;
}
