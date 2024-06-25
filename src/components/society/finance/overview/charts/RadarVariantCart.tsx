"use client";

import { Radar } from "react-chartjs-2";
import "chart.js/auto";
import { type RawGroupData } from "~/lib/types";

type RadarVariantChartProps = {
  data: RawGroupData[];
};

export default function RadarVariantChart({ data }: RadarVariantChartProps) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: "Category Values",
        data: data.map((d) => d.value),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#ccc",
        borderWidth: 1,
      },
    },
    scales: {},
  };

  return <Radar data={chartData} options={options} />;
}
