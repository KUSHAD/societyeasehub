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
} from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "~/components/ui/button";

interface ProfileMenuProps {
  currentUser: SafeUser | null;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ currentUser }) => {
  const pathname = usePathname();
  return currentUser ? (
    <>
      {pathname === "/" || pathname === "/pricing" ? (
        <Link
          href="/dashboard"
          className={buttonVariants({
            className: "mx-2 mt-3",
          })}
        >
          Dashboard
        </Link>
      ) : null}
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
          <Link href="/society/new">
            <DropdownMenuItem>New Society</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : pathname !== "/" && pathname !== "/pricing" ? (
    signIn(undefined, { callbackUrl: "/dashboard" })
  ) : (
    <div className="mt-4">
      <Link
        className={buttonVariants({
          className: "mx-2",
          variant: pathname === "/pricing" ? "secondary" : "link",
        })}
        href="/pricing"
      >
        Pricing
      </Link>
      <Button
        className="mx-2"
        onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
      >
        Sign In
      </Button>
    </div>
  );
};
export default ProfileMenu;
