"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import {
  BellIcon,
  EnvelopeOpenIcon,
  HomeIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

export const navLinks = [
  {
    href: "/",
    icon: <HomeIcon className="h-[24px] w-[24px]" />,
  },
  {
    href: "/society/new",
    icon: <PlusIcon className="h-[24px] w-[24px]" />,
  },
  {
    href: "/invite",
    icon: <EnvelopeOpenIcon className="h-[24px] w-[24px]" />,
  },
  {
    href: "/notifications",
    icon: <BellIcon className="h-[24px] w-[24px]" />,
  },
];

export default function NavContent() {
  const pathname = usePathname();
  return navLinks.map((_navLink) => (
    <div
      key={_navLink.href}
      className={cn(
        "mx-4 my-4 hidden sm:block",
        pathname === _navLink.href ? "opacity-100" : "opacity-20",
      )}
    >
      <Link href={_navLink.href}>{_navLink.icon}</Link>
    </div>
  ));
}
