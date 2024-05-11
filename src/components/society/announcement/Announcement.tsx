"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import type { AnnouncementsOutput } from "~/lib/types";
import MessageMemberCard from "../MessageMemberCard";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { api } from "~/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import AnnouncementComments from "./comment/AnnouncementComments";
import AttachmentViewContainer from "./attachment/AttachmentViewContainer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "~/components/ui/use-toast";

interface AnnouncementProps {
  announcement: AnnouncementsOutput;
}

export default function Announcement({ announcement }: AnnouncementProps) {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data } = api.member.canAnnounce.useQuery({
    societyId: id,
  });
  const utils = api.useUtils();

  const { isLoading: deleting, mutate: deleteAnnouncement } =
    api.announcement.delete.useMutation({
      async onSuccess() {
        await utils.announcement.getBySociety.invalidate({
          societyId: id,
        });

        toast({
          title: "Message",
          description: "Deleted Announcement",
        });
      },
    });
  return (
    <Card className="my-2">
      <CardHeader className="flex flex-row">
        <div className="mr-auto">
          <MessageMemberCard
            image={
              announcement.member.image ??
              "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg"
            }
            name={announcement.member.name ?? "User"}
            userId={announcement.member.id}
            societyId={id}
          />
          <small>
            <em>{format(announcement.createdAt, "dd/MM/yyyy  HH:mm")}</em>
          </small>
        </div>
        {isLoading ? null : data ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={deleting} size="icon" variant="ghost">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                disabled={deleting}
                onClick={() =>
                  deleteAnnouncement({
                    announcementId: announcement.id,
                    societyId: id,
                  })
                }
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col">
        <p>{announcement.content}</p>
        <strong>
          {announcement.attachments.length === 0 ? "" : "Attachments"}
        </strong>
        <div className="flex flex-row overflow-x-auto">
          {announcement.attachments.map((_attachment) => (
            <AttachmentViewContainer
              name={_attachment.name}
              key={_attachment.uri}
              uri={_attachment.uri}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="comments">
            <AccordionTrigger>
              {announcement._count.comments} Comments
            </AccordionTrigger>
            <AccordionContent>
              <AnnouncementComments announcementId={announcement.id} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
