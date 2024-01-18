"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { SafeUser } from "~/lib/types";
import SendInviteButton from "./SendInviteButton";

interface UserInviteCardProps {
  user: Partial<SafeUser>;
}

export default function UserInviteCard({ user }: UserInviteCardProps) {
  return (
    <div className="my-1 w-full rounded bg-accent">
      <div className="flex flex-row px-4 py-2">
        <div className="mr-auto flex flex-row">
          <Avatar className="mx-2">
            <AvatarImage
              src={
                user.image ??
                "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg"
              }
            />
            <AvatarFallback>{user.name?.slice(0, 1) ?? "U"}</AvatarFallback>
          </Avatar>
          <strong className="my-2">{user.name}</strong>
        </div>
        <SendInviteButton userId={user.id!} />
      </div>
    </div>
  );
}
