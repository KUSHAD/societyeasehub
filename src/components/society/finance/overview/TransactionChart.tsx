"use client";

import NotFound from "~/components/NotFound";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { ActiveDaysData } from "~/lib/types";
import AreaVariantChart from "./charts/AreaVariantChart";
import BarVariantChart from "./charts/BarVariantChart";
import LineVariantChart from "./charts/LineVariantChart";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { AreaChart, BarChart, LineChart } from "lucide-react";

type TransactionChartProps = {
  data?: ActiveDaysData[];
};

export default function TransactionChart({ data = [] }: TransactionChartProps) {
  const [chartType, setChartType] = useState<"Area" | "Bar" | "Line">("Area");

  function onChartTypeChange(type: "Area" | "Bar" | "Line") {
    setChartType(type);
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
        <Select defaultValue={chartType} onValueChange={onChartTypeChange}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Area">
              <div className="flex items-center">
                <AreaChart className="mr-2 size-4 shrink-0" />
                <div className="line-clamp-1">Area Chart</div>
              </div>
            </SelectItem>
            <SelectItem value="Bar">
              <div className="flex items-center">
                <BarChart className="mr-2 size-4 shrink-0" />
                <div className="line-clamp-1">Bar Chart</div>
              </div>
            </SelectItem>
            <SelectItem value="Line">
              <div className="flex items-center">
                <LineChart className="mr-2 size-4 shrink-0" />
                <div className="line-clamp-1">Line Chart</div>
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
            {chartType === "Area" && <AreaVariantChart data={data} />}
            {chartType === "Bar" && <BarVariantChart data={data} />}
            {chartType === "Line" && <LineVariantChart data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}
