"use client";

import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useState } from "react";
import NotFound from "~/components/NotFound";
import { generateRandomColor } from "~/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartData() {
  const { id } = useParams<{ id: string }>();
  const [pieData, setPieData] = useState<ChartData<"pie"> | null>(null);
  const { data, isLoading } = api.transaction.getPieChart.useQuery(
    {
      societyId: id,
    },
    {
      refetchInterval: false,
      onSuccess(__data) {
        setPieData({
          labels: __data.map((_data) => _data.label),
          datasets: [
            {
              data: __data.map((_data) => Number(_data.data)),
              backgroundColor: Array.from(__data).map(() =>
                generateRandomColor(),
              ),
            },
          ],
        });
      },
    },
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Splits</CardTitle>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Skeleton className="h-[300px] w-[300px] rounded-full" />
            </div>
          ) : data && data.length === 0 ? (
            <NotFound message="No Transaction data found for the selected period" />
          ) : (
            pieData && (
              <Pie
                data={pieData}
                width={300}
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
