"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type SafeMeeting } from "~/lib/types";

interface MeetingCardProps {
  meeting: SafeMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const { societyId } = useParams<{ societyId: string }>();
  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle>{meeting.title}</CardTitle>
        <CardDescription>{meeting.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div>
          <strong>Start Time :- </strong>
          {format(meeting.startTime, "dd/mm/yy  HH:mm")}
        </div>
        <div>
          <strong>End Time :-</strong>
          {format(meeting.endTime, "dd/MM/yy  HH:mm")}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row">
        <div className="mr-auto" />
        {meeting.status === "ONGOING" ? (
          <Link
            href={`/society/${societyId}/meeting/${meeting.id}`}
            className={buttonVariants()}
          >
            Join Meeting
          </Link>
        ) : null}
      </CardFooter>
    </Card>
  );
}
