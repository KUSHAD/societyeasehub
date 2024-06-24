"use client";

import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

type DoughnutVariantChartProps = {
  data: { name: string; value: number }[];
};

export default function DoughnutVariantChart({
  data,
}: DoughnutVariantChartProps) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {},
  };

  return <Doughnut data={chartData} options={options} />;
}
