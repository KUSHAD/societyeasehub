"use client";

import { Pie } from "react-chartjs-2";
import "chart.js/auto";

type PieVariantChartProps = {
  data: { name: string; value: number }[];
};

export default function PieVariantChart({ data }: PieVariantChartProps) {
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

  return <Pie data={chartData} options={options} />;
}
