"use client";

import { PolarArea } from "react-chartjs-2";
import "chart.js/auto";

type RadialVariantChartProps = {
  data: { name: string; value: number }[];
};

export default function RadialVariantChart({ data }: RadialVariantChartProps) {
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

  return <PolarArea data={chartData} options={options} />;
}
