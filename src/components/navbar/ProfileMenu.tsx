"use client";

import { signIn, signOut } from "next-auth/react";
import { type SafeUser } from "~/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileMenuProps {
  currentUser: SafeUser | null;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ currentUser }) => {
  return currentUser ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="my-2">
          <AvatarImage
            src={
              currentUser.image ??
              "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg"
            }
          />
          <AvatarFallback>
            {currentUser.name?.slice(0, 1) ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute right-0">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>My Invites</DropdownMenuItem>
        <DropdownMenuItem>Notifications</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>New Society</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    signIn()
  );
};
export default ProfileMenu;
