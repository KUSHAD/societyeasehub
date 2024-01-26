"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface SendInviteButtonProps {
  userId: string;
}

export default function SendInviteButton({ userId }: SendInviteButtonProps) {
  const { id } = useParams<{ id: string }>();
  const [sent, setSent] = useState(false);

  const { mutate: create, isLoading } = api.invite.create.useMutation({
    onSuccess() {
      setSent(true);
    },
  });

  return (
    <Button
      disabled={isLoading || sent}
      onClick={() =>
        create({
          societyId: id,
          userId,
        })
      }
      variant={sent ? "outline" : "default"}
    >
      {sent ? "Sent" : "Invite"}
    </Button>
  );
}
