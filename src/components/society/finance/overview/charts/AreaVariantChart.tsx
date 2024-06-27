"use client";

import { Line } from "react-chartjs-2";
import type { ActiveDaysData } from "~/lib/types";
import "chart.js/auto"; // This imports all the necessary chart.js components

type AreaVariantChartProps = {
  data: ActiveDaysData[];
};

export default function AreaVariantChart({ data }: AreaVariantChartProps) {
  // Transform data for chart.js
  const transformedData = {
    labels: data.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
    ),
    datasets: [
      {
        label: "Income",
        data: data.map((d) => d.income),
        borderColor: "#3d82bf",
        backgroundColor: "rgba(61, 130, 191, 0.8)",
        tension: 0.4,
        fill: true,
        opacity: 0.8,
      },
      {
        label: "Expense",
        data: data.map((d) => d.expense),
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.8)",
        tension: 0.4,
        opacity: 0.8,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount",
        },
      },
    },
  };

  return <Line data={transformedData} options={options} />;
}
