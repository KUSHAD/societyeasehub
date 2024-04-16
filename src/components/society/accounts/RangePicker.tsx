"use client";

import { useCallback, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { startOfMonth, endOfMonth, format } from "date-fns";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { type Route } from "next";
import { type DateRange } from "react-day-picker";
import { api } from "~/trpc/react";

export default function RangePicker() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const utils = api.useUtils();

  const [date, setDate] = useState<DateRange>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : startOfMonth(new Date()),
    to: searchParams.get("to")
      ? new Date(searchParams.get("to")!)
      : endOfMonth(new Date()),
  });

  const handleDateChange = useCallback(
    async (_date: DateRange | undefined) => {
      const currentQuery = {};

      const urlFromDate = new Date(_date!.from!).toISOString();
      const urlToDate = new Date(_date!.to!).toISOString();

      const updatedQuery = {
        ...currentQuery,
        from: urlFromDate,
        to: urlToDate,
      };

      setDate(_date!);

      const url = qs.stringifyUrl(
        {
          url: `accounts`,
          query: updatedQuery,
        },
        { skipNull: true },
      );

      router.push(url as Route);

      await utils.transaction.invalidate();
    },
    [router],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "my-2 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Choose Date Range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from as unknown as Date}
          selected={date}
          onSelect={handleDateChange}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}
