import Skeleton from "react-loading-skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-row">
        <div className="mr-auto" />
        <Skeleton className="h-10 w-10" />
      </div>
      <Skeleton className="my-2 h-[200px] w-full" count={5} />
    </>
  );
}
