"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import NotFound from "~/components/NotFound";
import { generateRandomColor } from "~/lib/utils";
import { startOfMonth, endOfMonth } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function LineChartData() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [lineData, setLineData] = useState<ChartData<"line"> | null>(null);
  const { data: apiData, isLoading } =
    api.transaction.getLineChartData.useQuery(
      {
        societyId: id,
        from: searchParams.get("from")
          ? new Date(searchParams.get("from")!)
          : startOfMonth(new Date()),
        to: searchParams.get("to")
          ? new Date(searchParams.get("to")!)
          : endOfMonth(new Date()),
      },
      {
        onSuccess(data) {
          if (data && data.length > 0) {
            const labels = [...new Set(data.map((item) => item.date))];
            const datasets: {
              label: string;
              data: number[];
              borderColor: string;
              backgroundColor: string;
            }[] = [];

            data.forEach((item) => {
              const existingDatasetIndex = datasets.findIndex(
                (dataset) => dataset.label === item.type,
              );
              if (
                existingDatasetIndex !== -1 &&
                datasets[existingDatasetIndex]
              ) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                datasets[existingDatasetIndex].data.push(item.sum);
              } else {
                const color = generateRandomColor();
                datasets.push({
                  label: item.type,
                  data: [item.sum],
                  borderColor: color,
                  backgroundColor: color,
                });
              }
            });

            setLineData({
              labels,
              datasets,
            });
          } else {
            setLineData(null);
          }
        },
      },
    );
  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle>Daily Splits</CardTitle>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : apiData && apiData.length === 0 ? (
            <NotFound message="No Transaction data found for the selected period" />
          ) : (
            lineData && (
              <Line
                data={lineData}
                width={"100%"}
                height={300}
                options={{ maintainAspectRatio: false, responsive: true }}
              />
            )
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
}
