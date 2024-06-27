"use client";

import { type RawGroupData } from "~/lib/types";
import CategoryChart from "./CategoryChart";
import PayeeChart from "./PayeeChart";

type SpendChartProps = {
  categoryData?: RawGroupData[];
  payeeData?: RawGroupData[];
};

export default function SpendChart({
  categoryData = [],
  payeeData = [],
}: SpendChartProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2">
      <CategoryChart data={categoryData} />
      <PayeeChart data={payeeData} />
    </div>
  );
}
