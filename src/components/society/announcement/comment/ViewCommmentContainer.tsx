"use client";

import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { useIntersectionObserver } from "@uidotdev/usehooks";

interface ViewCommmentContainerProps {
  comment: {
    id: string;
    user: {
      name: string | null;
      image: string | null;
    };
    content: string;
    announcementId: string;
  };
}

export default function ViewCommmentContainer({
  comment,
}: ViewCommmentContainerProps) {
  const { societyId } = useParams<{ societyId: string }>();
  const utils = api.useUtils();
  const { isPending: deleting, mutate: deleteComment } =
    api.announcementComment.delete.useMutation({
      async onSuccess() {
        await utils.announcementComment.getByAnnouncement.invalidate({
          announcementId: comment.announcementId,
        });
        await utils.announcement.getBySociety.invalidate({
          societyId,
        });
        toast({
          title: "Message",
          description: "Comment Deleted",
        });
      },
    });

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });
  return (
    <div className="my-2 flex flex-col rounded border p-2" ref={ref}>
      {entry?.isIntersecting && (
        <>
          <div className="flex flex-row">
            <div className="mr-auto flex flex-row">
              <Avatar className="my-1">
                <AvatarImage
                  src={
                    comment.user.image ??
                    "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg"
                  }
                />
                <AvatarFallback>
                  {comment.user.name?.slice(0, 1) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <strong className="mx-2 my-3">
                {comment.user.name ?? "User"}
              </strong>
            </div>
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
                    deleteComment({
                      announcementId: comment.announcementId,
                      commentId: comment.id,
                      societyId,
                    })
                  }
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <span className="text-lg">{comment.content}</span>
        </>
      )}
    </div>
  );
}
