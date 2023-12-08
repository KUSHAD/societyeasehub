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
import Link from "next/link";

interface ProfileMenuProps {
  currentUser: SafeUser | null;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ currentUser }) => {
  return currentUser ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="my-2 cursor-pointer">
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
        <Link href="/profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <Link href="/subscription">
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/invite">
          <DropdownMenuItem>My Invites</DropdownMenuItem>
        </Link>
        <Link href="/notifications">
          <DropdownMenuItem>Notifications</DropdownMenuItem>
        </Link>
        <Link href="/society/new">
          <DropdownMenuItem>New Society</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    signIn()
  );
};
export default ProfileMenu;
