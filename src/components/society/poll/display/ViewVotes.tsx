"use client";

import Skeleton from "react-loading-skeleton";
import { api } from "~/trpc/react";
import VoteContainer from "./VoteContainer";

export default function ViewVotes(props: { pollId: string; options: number }) {
  const { data, isPending } = api.poll.getVotes.useQuery({
    pollId: props.pollId,
  });
  return isPending ? (
    <Skeleton className="my-2 h-16 w-full" count={props.options} />
  ) : (
    data?.map((_vote) => <VoteContainer vote={_vote} key={_vote.name} />)
  );
}
