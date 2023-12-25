"use client";
import { usePathname } from "next/navigation";
import TabContents from "./TabContents";
import { cn } from "~/lib/utils";

export default function Tab() {
  const pathname = usePathname();
  return (
    <footer
      className={cn(
        "sticky bottom-0 left-0 z-10 block border-t bg-background sm:hidden",
        pathname === "/dashboard" ? "block" : "hidden",
      )}
    >
      <div className="flex flex-row justify-between">
        <TabContents />
      </div>
    </footer>
  );
}
