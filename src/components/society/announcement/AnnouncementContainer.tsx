"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import AnnouncementSkeleton from "./AnnouncementSkeleton";
import Announcement from "./Announcement";
import NotFound from "~/components/NotFound";

export default function AnnouncementContainer() {
  const { societyId } = useParams<{ societyId: string }>();
  const { data, isPending } = api.announcement.getBySociety.useQuery({
    societyId,
  });

  return isPending ? (
    <AnnouncementSkeleton />
  ) : data && data.length !== 0 ? (
    data.map((_announcement) => (
      <Announcement announcement={_announcement} key={_announcement.id} />
    ))
  ) : (
    <NotFound message="No Announcements found" />
  );
}
