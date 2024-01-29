"use client";

import { CircleSlash, MoreVertical, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import type { SocietyUsersOutput } from "~/lib/types";
import { type MembersProps } from "./Members";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import AssignRole from "./AssignRole";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import KickMember from "./KickMember";

interface MemberCardProps extends MembersProps {
  member: SocietyUsersOutput;
}

export default function MemberCard({
  member,
  canAssignRoles,
  canKick,
}: MemberCardProps) {
  return (
    <div className="my-2 w-full scale-95 rounded bg-accent shadow-md">
      <div className="mx-4 flex flex-row justify-between py-2">
        <div className="flex flex-row">
          <Avatar className="mx-2">
            <AvatarImage
              src={
                member.user.image ??
                "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg"
              }
            />
            <AvatarFallback>
              {member.user.name?.slice(0, 1) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <strong className="my-2">{member.user.name}</strong>
        </div>
        <em className="my-2">{member.role?.name ?? "Not Assigned"}</em>
        {canAssignRoles || canKick ? (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {canAssignRoles ? (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <UserCog className="mx-2" />
                      Assign Role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <AssignRole userId={member.user.id} />
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ) : null}
                {canKick ? (
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>
                      <CircleSlash className="mx-2" /> Can Kick
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <KickMember userId={member.user.id} />
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  );
}
