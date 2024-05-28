"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import AnnouncementCommentInput from "./AnnouncementCommentInput";
import Skeleton from "react-loading-skeleton";
import NotFound from "~/components/NotFound";
import ViewCommmentContainer from "./ViewCommmentContainer";

export default function AnnouncementComments(props: {
  announcementId: string;
  commentCount: number;
}) {
  const { societyId } = useParams<{ societyId: string }>();

  const { data: perms, isLoading: gettingPerms } =
    api.perms.canComment.useQuery({
      societyId,
    });

  const { data: comments, isLoading } =
    api.announcementComment.getByAnnouncement.useQuery({
      announcementId: props.announcementId,
    });
  return (
    <>
      {isLoading ? (
        <Skeleton className="w-100 my-2 h-[40px]" count={props.commentCount} />
      ) : comments && comments.length !== 0 ? (
        comments.map((_comment) => (
          <ViewCommmentContainer comment={_comment} key={_comment.id} />
        ))
      ) : (
        <NotFound message="No Comments for this announcement" />
      )}
      {gettingPerms ? null : perms ? (
        <AnnouncementCommentInput announcementId={props.announcementId} />
      ) : null}
    </>
  );
}
