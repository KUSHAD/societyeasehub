"use client";

import { PersonIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface InviteCardProps {
  invite: {
    society: {
      id: string;
      name: string;
      _count: {
        members: number;
      };
    };
  };
}

export default function InviteCard({ invite: { society } }: InviteCardProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const { mutate: reject, isLoading: rejecting } =
    api.invite.reject.useMutation({
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },
      retryDelay: 500,
      onSuccess: async () => {
        await utils.invite.getPendingCount.invalidate();
        await utils.invite.getUserPending.invalidate();
      },
    });

  const { mutate: accept, isLoading: accepting } =
    api.invite.accept.useMutation({
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },
      retryDelay: 500,
      onSuccess: async (data) => {
        router.push(`/society/${data.societyId}`);
        await utils.invite.getPendingCount.invalidate();
        await utils.invite.getUserPending.invalidate();
      },
    });
  return (
    <div className="w-full rounded bg-accent">
      <div className="px-4 py-2">
        <div className="flex flex-row">
          <strong className="mr-auto">{society.name}</strong>
          <em className="flex  flex-row">
            <PersonIcon className="my-1" /> {society._count.members} Members
          </em>
        </div>
        <div className="flex flex-row">
          <div className="mr-auto" />
          <Button
            onClick={() =>
              reject({
                societyId: society.id,
              })
            }
            className="mx-2"
            variant="destructive"
          >
            {rejecting ? "Rejecting .." : "Reject"}
          </Button>
          <Button
            onClick={() =>
              accept({
                societyId: society.id,
              })
            }
            className="mx-2"
          >
            {accepting ? "Accepting" : "Accept"}
          </Button>
        </div>
      </div>
    </div>
  );
}
