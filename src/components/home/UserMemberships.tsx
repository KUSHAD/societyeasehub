"use client";

import Skeleton from "react-loading-skeleton";
import { Ghost } from "lucide-react";
import { EnvelopeOpenIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import SocietyCard from "./SocietyCard";
import ClientOnly from "../ClientOnly";
import React from "react";
import { api } from "~/trpc/react";

export default function UserMemberships() {
  const { data: userMemberShips, isLoading } =
    api.society.getUserMemberships.useQuery();
  return isLoading ? (
    <Skeleton height={75} className="my-2" count={10} />
  ) : userMemberShips && userMemberShips.length !== 0 ? (
    <>
      <h1 className="mb-3 text-xl font-bold text-gray-900">My Societies</h1>
      {userMemberShips.map((_membership) => (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ClientOnly>
            <SocietyCard key={_membership.id} society={_membership} />
          </ClientOnly>
        </div>
      ))}
    </>
  ) : (
    <div className="mt-16 flex flex-col items-center gap-2">
      <Ghost className="h-8 w-8 text-zinc-800" />
      <h3 className="text-xl font-semibold">
        You have don&apos;t membership in any society
      </h3>
      <p>Create a new society or ask the owner to invite you</p>
      <Link className={buttonVariants()} href="/society/new">
        <PlusIcon className="mx-2" />
        Create a new Society
      </Link>
      <Link
        className={buttonVariants({
          variant: "outline",
        })}
        href="/invite"
      >
        <EnvelopeOpenIcon className="mx-2" />
        See Invites
      </Link>
    </div>
  );
}
