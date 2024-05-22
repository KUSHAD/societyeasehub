"use client";

import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Hash } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { type SafeChannel } from "~/lib/types";

interface ChannelButtonProps {
  channel: SafeChannel;
}

export default function ChannelButton({ channel }: ChannelButtonProps) {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  return (
    <div ref={ref}>
      {entry?.isIntersecting ? (
        <Link
          href={`/society/${id}/feed/channel/${channel.id}`}
          className={buttonVariants({
            className: "my-2 w-full",
            variant:
              pathname === `/society/${id}/feed/channel/${channel.id}`
                ? "outline"
                : "ghost",
          })}
        >
          <Hash className="mx-2 my-1" />
          {channel.name}
        </Link>
      ) : null}
    </div>
  );
}
