"use client";

import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { RefreshCw } from "lucide-react";

interface MessageMemberCard {
  name: string;
  image: string;
  societyId: string;
  userId: string;
}

export default function MessageMemberCard({
  image,
  name,
  societyId,
  userId,
}: MessageMemberCard) {
  const { data: isMember, isLoading } = api.member.getDetails.useQuery({
    societyId,
    userId,
  });
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex w-1/3 flex-row text-left hover:underline">
          <Avatar className="mx-2 h-[35px] w-[35px]">
            <AvatarImage src={image} />
            <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <strong>{name}</strong>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        {isLoading ? (
          <div className="flex flex-row">
            <RefreshCw className="animate-spin" />{" "}
            <span className="mx-2">Getting Member Status</span>
          </div>
        ) : isMember && isMember ? (
          <div className="flex flex-row">
            <Avatar className="mx-2 h-[50x] w-[50px]">
              <AvatarImage src={image} />
              <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <strong>{name}</strong>
          </div>
        ) : (
          <span>The member has left the society</span>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
