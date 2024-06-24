import { OverviewDataCardLoading } from "~/components/society/finance/overview/OverviewDataCard";

export default function Loading() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-2">
      <OverviewDataCardLoading />
      <OverviewDataCardLoading />
      <OverviewDataCardLoading />
    </div>
  );
}
