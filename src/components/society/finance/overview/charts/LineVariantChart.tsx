"use client";

import { Line } from "react-chartjs-2";
import type { ActiveDaysData } from "~/lib/types";
import "chart.js/auto"; // This imports all the necessary chart.js components

type LineVariantChartProps = {
  data: ActiveDaysData[];
};

export default function LineVariantChart({ data }: LineVariantChartProps) {
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
        backgroundColor: "rgba(61, 130, 191, 0.2)",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: data.map((d) => d.expense),
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {},
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
