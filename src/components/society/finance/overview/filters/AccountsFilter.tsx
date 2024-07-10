"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type Route } from "next";

import { api } from "~/trpc/react";
import qs from "query-string";

export default function AccountsFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const account = searchParams.get("accountId") ?? "all";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const router = useRouter();

  const { societyId } = useParams<{ societyId: string }>();

  const { isPending: gettingSummary } = api.financeSummary.get.useQuery({
    societyId,
    from,
    to,
    accountId: account,
  });

  const { data, isPending } = api.financeAccounts.getBySociety.useQuery({
    societyId,
  });

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from: from,
      to: to,
    };

    if (newValue === "all") {
      query.accountId = "";
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url as Route);
  };

  return (
    <Select
      disabled={isPending || gettingSummary}
      value={account}
      onValueChange={onChange}
    >
      <SelectTrigger className="h-9 w-full rounded-md lg:w-auto">
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Accounts</SelectItem>
        {data?.map((_data) => (
          <SelectItem key={_data.id} value={_data.id}>
            {_data.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
