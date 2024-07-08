"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface SendInviteButtonProps {
  userId: string;
}

export default function SendInviteButton({ userId }: SendInviteButtonProps) {
  const { societyId } = useParams<{ societyId: string }>();
  const [sent, setSent] = useState(false);

  const { mutate: create, isPending } = api.invite.create.useMutation({
    onSuccess() {
      setSent(true);
    },
  });

  return (
    <Button
      disabled={isPending || sent}
      onClick={() =>
        create({
          societyId,
          userId,
        })
      }
      variant={sent ? "outline" : "default"}
    >
      {sent ? "Sent" : "Invite"}
    </Button>
  );
}
