"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import NotFound from "~/components/NotFound";
import { api } from "~/trpc/react";
import MeetingCard from "./MeetingCard";

export default function ShowMeetingContainer() {
  const { societyId } = useParams<{ societyId: string }>();
  const { data: meetings, isPending } = api.meetingRoom.getBySociety.useQuery({
    societyId,
  });
  return (
    <>
      {isPending ? (
        <Skeleton className="my-2 h-[200px] w-full" count={10} />
      ) : meetings && meetings.length === 0 ? (
        <NotFound
          message="No Meetings found"
          description="Create a meeting if you  have perms and you  will see them here"
        />
      ) : (
        <>
          <strong>Ongoing Meetings</strong>
          {meetings?.filter((_meeting) => _meeting.status === "ONGOING")
            .length === 0 ? (
            <NotFound message="No Ongoing  meetings" />
          ) : (
            meetings
              ?.filter((_meeting) => _meeting.status === "ONGOING")
              ?.map((_meeting) => (
                <MeetingCard meeting={_meeting} key={_meeting.id} />
              ))
          )}
          <strong>Upcoming Meetings</strong>
          {meetings?.filter((_meeting) => _meeting.status === "UPCOMING")
            .length === 0 ? (
            <NotFound message="No Upcoming Meetings" />
          ) : (
            meetings
              ?.filter((_meeting) => _meeting.status === "UPCOMING")
              ?.map((_meeting) => (
                <MeetingCard meeting={_meeting} key={_meeting.id} />
              ))
          )}
        </>
      )}
    </>
  );
}
