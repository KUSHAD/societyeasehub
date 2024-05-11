"use client";

import Skeleton from "react-loading-skeleton";

export default function AnnouncementSkeleton() {
  return <Skeleton className="my-2 h-[300px] w-full rounded" count={5} />;
}
