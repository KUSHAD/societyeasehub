"use client";

import { Button } from "~/components/ui/button";
import AccountsFilter from "./AccountsFilter";
import DateFilter from "./DateFilter";
import { useParams } from "next/navigation";
import { useShareModalStore } from "~/store/shareModal";
import { absoluteUrl } from "~/lib/utils";

export default function FinanceFilters() {
  const { societyId } = useParams<{ societyId: string }>();
  const { onOpen } = useShareModalStore();
  return (
    <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2 lg:gap-y-0">
      <AccountsFilter />
      <DateFilter />
      <Button
        onClick={() =>
          onOpen(absoluteUrl(`/api/integration/transaction/${societyId}`))
        }
        variant="outline"
      >
        Integrate Overview
      </Button>
    </div>
  );
}
