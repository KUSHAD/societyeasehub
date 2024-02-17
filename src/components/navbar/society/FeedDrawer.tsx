"use client";

import { Ghost, Megaphone, Vote } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import CreateChannel from "~/components/society/channel/CreateChannel";
import { Button, buttonVariants } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import LoadingSkeleton from "react-loading-skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import ChannelButton from "~/components/society/channel/ChannelButton";

export default function FeedDrawer() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: manageChannels, isLoading: gettingPerms } =
    api.member.canManageChannels.useQuery({ societyId: id });

  const { data: channels, isLoading } = api.channel.getBySociety.useQuery({
    societyId: id,
  });

  return (
    <>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${id}/feed/announcement`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${id}/feed/announcement`}
      >
        <Megaphone className="mx-2 my-1" />
        Announcement
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${id}/feed/poll` ? "outline" : "ghost",
        })}
        href={`/society/${id}/feed/poll`}
      >
        <Vote className="mx-2 my-1" />
        Poll
      </Link>
      {gettingPerms ? (
        <Skeleton className="my-2 h-[40px] w-full" />
      ) : (
        manageChannels && <CreateChannel />
      )}

      <Accordion type="single" collapsible>
        <AccordionItem value="channels">
          <AccordionTrigger>Channels</AccordionTrigger>
          <AccordionContent>
            {isLoading ? (
              <LoadingSkeleton className="my-2 h-[40px] w-full" count={5} />
            ) : channels && channels.length === 0 ? (
              <Button className="my-2 w-full" variant="ghost" disabled>
                <Ghost className="mx-2 my-1" />
                No Channels
              </Button>
            ) : (
              channels?.map((_channel) => (
                <ChannelButton channel={_channel} key={_channel.id} />
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
