"use client";

import { useIntersectionObserver } from "@uidotdev/usehooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type PollForSociety } from "~/lib/types";
import MessageMemberCard from "../../MessageMemberCard";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { format, getTime, parseISO } from "date-fns";
import { toast } from "~/components/ui/use-toast";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import ViewVotes from "./ViewVotes";

interface PollViewerProps {
  poll: PollForSociety;
}

export default function PollViewer({ poll }: PollViewerProps) {
  const { id } = useParams<{ id: string }>();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  const { data } = useSession();

  const [selectedOptionID, setSelectedOptionID] = useState<string | null>(null);

  const utils = api.useUtils();
  const { data: perms, isLoading } = api.perms.canCreatePolls.useQuery({
    societyId: id,
  });

  const { data: votePerms, isLoading: gettingVotePerms } =
    api.perms.canVote.useQuery({
      societyId: id,
    });

  const { mutate: deletePoll, isLoading: deleting } =
    api.poll.delete.useMutation({
      async onSuccess() {
        await utils.poll.getBySociety.invalidate({ societyId: id });

        toast({
          title: "Message",
          description: "Poll Deleted",
        });
      },
    });

  const { mutate: castVote, isLoading: voting } = api.poll.vote.useMutation({
    async onSuccess() {
      await utils.poll.getBySociety.invalidate({ societyId: id });
      setSelectedOptionID(null);

      toast({
        title: "Message",
        description: "Your vote has been casted",
      });
    },
  });

  const { mutate: removeVote, isLoading: removing } =
    api.poll.removeVote.useMutation({
      async onSuccess() {
        await utils.poll.getBySociety.invalidate({ societyId: id });

        toast({
          title: "Message",
          description: "Your vote has been removed",
        });
      },
    });

  return (
    <AlertDialog>
      <Card ref={ref} className="my-2">
        {entry?.isIntersecting ? (
          <>
            <CardHeader className="flex flex-row">
              <div className="mr-auto">
                <MessageMemberCard
                  image={
                    poll.user.image ??
                    "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg"
                  }
                  name={poll.user.name ?? "User"}
                  userId={poll.user.id}
                  societyId={id}
                />
                <small>
                  <em>{format(poll.createdAt, "dd/MM/yyyy  HH:mm")}</em>
                </small>
              </div>
              {isLoading ? null : perms ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={
                        deleting ||
                        getTime(poll.validTill) < getTime(Date.now())
                      }
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      disabled={deleting}
                      onClick={() =>
                        deletePoll({
                          pollId: poll.id,
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
            <CardContent>
              <CardTitle>{poll.question}</CardTitle>
              {poll.options.map((_option) => (
                <Button
                  disabled={
                    gettingVotePerms ||
                    !votePerms ||
                    voting ||
                    poll.votes.filter((_vote) => _vote.userId === data?.user.id)
                      .length !== 0 ||
                    getTime(parseISO(poll.validTill.toISOString())) <
                      getTime(Date.now())
                  }
                  className="my-1 w-full"
                  key={_option.id}
                  variant={
                    selectedOptionID === _option.id ? "secondary" : "outline"
                  }
                  onClick={() => setSelectedOptionID(_option.id)}
                >
                  {_option.name}
                </Button>
              ))}
            </CardContent>
            <CardFooter className="flex flex-row justify-between">
              <CardDescription>
                You can cast your Vote Till{" "}
                {format(poll.validTill, "dd/MM/yyyy  HH:mm")}hrs
              </CardDescription>
              <AlertDialogTrigger asChild>
                <Button variant="link">{poll._count.votes} Votes</Button>
              </AlertDialogTrigger>
              {gettingVotePerms ? null : votePerms ? (
                poll.votes.filter((_vote) => _vote.userId === data?.user.id)
                  .length !== 0 ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      removeVote({
                        pollId: poll.id,
                        societyId: id,
                      });
                    }}
                    disabled={
                      removing ||
                      getTime(parseISO(poll.validTill.toISOString())) <
                        getTime(Date.now())
                    }
                  >
                    Remove Your Vote
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      castVote({
                        optionId: selectedOptionID!,
                        pollId: poll.id,
                        societyId: id,
                      });
                    }}
                    disabled={
                      !selectedOptionID ||
                      voting ||
                      getTime(parseISO(poll.validTill.toISOString())) <
                        getTime(Date.now())
                    }
                  >
                    Cast Your Vote
                  </Button>
                )
              ) : null}
            </CardFooter>
          </>
        ) : null}
      </Card>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{poll.question}</AlertDialogTitle>
          <AlertDialogDescription>View Votes</AlertDialogDescription>
        </AlertDialogHeader>
        <ViewVotes pollId={poll.id} options={poll.options.length} />
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
