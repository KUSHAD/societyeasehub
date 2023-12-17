"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

export default function BackBar() {
  const params = useParams<{ id: string }>();
  const { data: name, isLoading } = api.society.getSocietyName.useQuery(params);
  return (
    <div className="border-y px-2 py-4">
      <Link
        className={buttonVariants({
          variant: "ghost",
        })}
        href="/dashboard"
      >
        <ChevronLeft />
        <span>
          {isLoading ? (
            <Skeleton className="mx-2 h-5 w-1/4" />
          ) : (name?.length ?? 0) > 25 ? (
            `${name?.slice(0, 24)}...`
          ) : (
            name
          )}
        </span>
      </Link>
    </div>
  );
}
