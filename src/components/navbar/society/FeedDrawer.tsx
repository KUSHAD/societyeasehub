"use client";

import { Megaphone, Plus, Vote } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Button, buttonVariants } from "~/components/ui/button";

export default function FeedDrawer() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();

  return (
    <>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${id}/feed/announcement`
              ? "outline"
              : "ghost",
        })}
        href={`/society/${id}/feed/announcement`}
      >
        <Megaphone className="mx-2 my-1" />
        Announcement
      </Link>
      <Link
        className={buttonVariants({
          className: "my-2 w-full",
          variant:
            pathname === `/society/${id}/feed/poll` ? "outline" : "ghost",
        })}
        href={`/society/${id}/feed/poll`}
      >
        <Vote className="mx-2 my-1" />
        Poll
      </Link>
      <Button className="my-2 w-full" variant="default">
        <Plus className="mx-2 my-1" />
        Create Channel
      </Button>
    </>
  );
}
