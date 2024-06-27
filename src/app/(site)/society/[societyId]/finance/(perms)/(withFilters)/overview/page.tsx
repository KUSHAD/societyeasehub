"use client";

import OverviewDataCharts from "~/components/society/finance/overview/OverviewDataCharts";
import OverviewDataGrid from "~/components/society/finance/overview/OverviewDataGrid";

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl pb-10">
      <OverviewDataGrid />
      <OverviewDataCharts />
    </div>
  );
}
