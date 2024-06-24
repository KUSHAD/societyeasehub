"use client";

import { Bar } from "react-chartjs-2";
import type { ActiveDaysData } from "~/lib/types";
import "chart.js/auto"; // This imports all the necessary chart.js components

type BarVariantChartProps = {
  data: ActiveDaysData[];
};

export default function BarVariantChart({ data }: BarVariantChartProps) {
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
        backgroundColor: "rgba(61, 130, 191, 0.8)",
        borderColor: "#3d82bf",
        borderWidth: 1,
      },
      {
        label: "Expense",
        data: data.map((d) => d.expense),
        backgroundColor: "rgba(244, 63, 94, 0.8)",
        borderColor: "#f43f5e",
        borderWidth: 1,
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

  return <Bar data={transformedData} options={options} />;
}
