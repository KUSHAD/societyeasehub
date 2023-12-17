"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { EnvelopeOpenIcon, HomeIcon, PlusIcon } from "@radix-ui/react-icons";
import { type UrlObject } from "url";

export const navLinks = [
  {
    href: "/" as UrlObject | string,
    icon: <HomeIcon className="h-[24px] w-[24px]" />,
  },
  {
    href: "/society/new" as UrlObject | string,
    icon: <PlusIcon className="h-[24px] w-[24px]" />,
  },
  {
    href: "/invite" as UrlObject | string,
    icon: <EnvelopeOpenIcon className="h-[24px] w-[24px]" />,
  },
];

export default function NavContent() {
  const pathname = usePathname();
  return navLinks.map((_navLink) => (
    <div
      key={_navLink.href as string}
      className={cn(
        "mx-4 my-4 hidden sm:block",
        pathname === _navLink.href ? "opacity-100" : "opacity-20",
      )}
    >
      <Link href={_navLink.href as UrlObject}>{_navLink.icon}</Link>
    </div>
  ));
}
