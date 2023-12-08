"use client";

import { usePathname } from "next/navigation";
import { navLinks } from "./Contents";
import Link from "next/link";
import { cn } from "~/lib/utils";

export default function TabContents() {
  const pathname = usePathname();

  return navLinks.map((_navLink) => (
    <div
      key={_navLink.href}
      className={cn(
        "mx-4 my-4",
        pathname === _navLink.href ? "opacity-100" : "opacity-20",
      )}
    >
      <Link href={_navLink.href}>{_navLink.icon}</Link>
    </div>
  ));
}
