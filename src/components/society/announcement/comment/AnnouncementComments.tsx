"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import AnnouncementCommentInput from "./AnnouncementCommentInput";

export default function AnnouncementComments(props: {
  announcementId: string;
}) {
  const { id } = useParams<{ id: string }>();

  const { data: perms, isLoading: gettingPerms } =
    api.member.canComment.useQuery({
      societyId: id,
    });
  return (
    <>
      {props.announcementId}
      {gettingPerms ? null : perms ? (
        <AnnouncementCommentInput announcementId={props.announcementId} />
      ) : null}
    </>
  );
}
