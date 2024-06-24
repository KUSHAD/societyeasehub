"use client";

import NotFound from "~/components/NotFound";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { RawGroupData } from "~/lib/types";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PieChart } from "lucide-react";
import RadialVariantChart from "./charts/RadialVariantChart";
import DoughnutVariantChart from "./charts/DoughnutVariantChart";
import PieVariantChart from "./charts/PieVariantChart";
import RadialChart from "~/components/icons/RadialChart";
import DoughnutChart from "~/components/icons/DoughnutChart";

type PayeeChartProps = {
  data?: RawGroupData[];
};

export default function PayeeChart({ data = [] }: PayeeChartProps) {
  const [chartType, setChartType] = useState<"Pie" | "Doughnut" | "Radial">(
    "Pie",
  );

  function onChartTypeChange(type: "Pie" | "Doughnut" | "Radial") {
    setChartType(type);
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Payee</CardTitle>
        <Select defaultValue={chartType} onValueChange={onChartTypeChange}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pie">
              <div className="flex items-center">
                <PieChart className="mr-2 size-4 shrink-0" />
                <div className="line-clamp-1">Pie Chart</div>
              </div>
            </SelectItem>
            <SelectItem value="Doughnut">
              <div className="flex items-center">
                <DoughnutChart className="mr-2 size-4 shrink-0" />
                <div className="line-clamp-1">Doughnut Chart</div>
              </div>
            </SelectItem>
            <SelectItem value="Radial">
              <div className="flex items-center">
                <RadialChart className="mr-2 size-4 shrink-0" />
                <div className="line-clamp-1">Radial Chart</div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <NotFound message="No data for this period" />
        ) : (
          <>
            {chartType === "Pie" && <PieVariantChart data={data} />}
            {chartType === "Doughnut" && <DoughnutVariantChart data={data} />}
            {chartType === "Radial" && <RadialVariantChart data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}
