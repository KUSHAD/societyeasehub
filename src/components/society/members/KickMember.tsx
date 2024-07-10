"use client";

import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

interface KickMemberProps {
  userId: string;
}

export default function KickMember({ userId }: KickMemberProps) {
  const utils = api.useUtils();
  const { societyId } = useParams<{ societyId: string }>();
  const { mutate: kick, isPending } = api.member.kick.useMutation({
    onSuccess: async () => {
      await utils.member.getBySociety.invalidate();
      toast({
        title: "Success",
        description: "User kicked",
      });
    },
  });
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Kick Member from this society</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        Kicking this user from this society will only remove them from the
        society and it&apos;s access is removed but users can still invite them
        again
      </AlertDialogDescription>
      <AlertDialogFooter>
        <Button
          onClick={() =>
            kick({
              societyId,
              userId,
            })
          }
          disabled={isPending}
        >
          {isPending ? <RefreshCcw className="animate-spin" /> : "Kick"}
        </Button>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  );
}
