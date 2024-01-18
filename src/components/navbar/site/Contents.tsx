"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { HomeIcon, PlusIcon } from "@radix-ui/react-icons";
import { type UrlObject } from "url";
import InviteNavIcon from "./InviteNavIcon";

export const navLinks = [
  {
    href: "/dashboard" as UrlObject | string,
    icon: <HomeIcon className="h-[24px] w-[24px]" />,
  },
  {
    href: "/society/new" as UrlObject | string,
    icon: <PlusIcon className="h-[24px] w-[24px]" />,
  },
];

export default function NavContent() {
  const pathname = usePathname();
  return (
    <>
      {navLinks.map((_navLink) => (
        <div
          key={_navLink.href as string}
          className={cn(
            "mx-4 my-4 hidden sm:block",
            pathname === _navLink.href ? "opacity-100" : "opacity-20",
          )}
        >
          <Link href={_navLink.href as UrlObject}>{_navLink.icon}</Link>
        </div>
      ))}

      <InviteNavIcon className="hidden sm:block" />
    </>
  );
}
