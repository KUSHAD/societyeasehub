"use client";

import { usePathname } from "next/navigation";
import { navLinks } from "./Contents";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { type Route } from "next";

export default function TabContents() {
  const pathname = usePathname();

  return navLinks.map((_navLink) => (
    <div
      key={_navLink.href as string}
      className={cn(
        "mx-4 my-4",
        pathname === _navLink.href ? "opacity-100" : "opacity-20",
      )}
    >
      <Link href={_navLink.href as Route<string>}>{_navLink.icon}</Link>
    </div>
  ));
}
