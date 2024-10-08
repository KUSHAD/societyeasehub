"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useDebounce } from "@uidotdev/usehooks";
import Skeleton from "react-loading-skeleton";
import UserInviteCard from "./UserInviteCard";
import NotFound from "~/components/NotFound";

export default function CreateInviteContent() {
  const { societyId } = useParams<{ societyId: string }>();
  const [searchString, setSearchString] = useState("");
  const debouncedSearchSring = useDebounce(searchString, 500);

  const { data: users, isPending } = api.invite.search.useQuery(
    {
      searchString: debouncedSearchSring,
      societyId,
    },
    {
      enabled: !!debouncedSearchSring,
    },
  );

  return (
    <>
      <Input
        placeholder="Search user by name or email ..."
        onChange={(e) => setSearchString(e.target.value)}
      />
      {isPending && Boolean(debouncedSearchSring) ? (
        <Skeleton className="my-2 h-12 w-full scale-95" count={9} />
      ) : users && users.length !== 0 ? (
        users.map((_user) => <UserInviteCard user={_user} />)
      ) : Boolean(debouncedSearchSring) ? (
        <NotFound message="No User Found" />
      ) : null}
    </>
  );
}
