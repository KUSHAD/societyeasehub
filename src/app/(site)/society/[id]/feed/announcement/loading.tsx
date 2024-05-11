import AnnouncementSkeleton from "~/components/society/announcement/AnnouncementSkeleton";
import Skeleton from "react-loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col">
      <Skeleton className="my-2 h-[200px] w-full rounded" />
      <AnnouncementSkeleton />
    </div>
  );
}
