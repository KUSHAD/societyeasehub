"use client";

import AccountsFilter from "./AccountsFilter";
import DateFilter from "./DateFilter";

export default function FinanceFilters() {
  return (
    <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:gap-x-2 lg:gap-y-0">
      <AccountsFilter />
      <DateFilter />
    </div>
  );
}
