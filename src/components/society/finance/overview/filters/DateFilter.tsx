"use client";

import { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, subDays, isValid, parseISO } from "date-fns";

import { formatDateRange } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Route } from "next";
import { type DateRange } from "react-day-picker";

export default function DateFilter() {
  const searchParams = useSearchParams();

  const account = searchParams.get("accountId") ?? "";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const parsedFrom = from ? parseISO(from) : defaultFrom;
  const parsedTo = to ? parseISO(to) : defaultTo;

  const paramState = {
    from: isValid(parsedFrom) ? parsedFrom : defaultFrom,
    to: isValid(parsedTo) ? parsedTo : defaultTo,
  };

  const router = useRouter();
  const pathname = usePathname();

  const [date, setDate] = useState<DateRange | undefined>({
    from: paramState.from,
    to: paramState.to,
  });

  const handleDateChange = (_date: DateRange | undefined) => {
    const query = {
      from: format(_date?.from ?? defaultFrom, "yyyy-MM-dd"),
      to: format(_date?.to ?? defaultTo, "yyyy-MM-dd"),
      accountId: account,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );

    router.push(url as Route);
  };

  const onReset = () => {
    setDate(undefined);
    handleDateChange(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className="h-9 w-full rounded-md lg:w-auto"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{formatDateRange(paramState)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={date}
          initialFocus
          mode="range"
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="flex w-full items-center gap-x-2 p-4">
          <PopoverClose asChild>
            <>
              <Button
                onClick={onReset}
                disabled={!date?.from || !date?.to}
                className="w-full"
                variant="outline"
              >
                Reset
              </Button>
              <Button
                onClick={() => handleDateChange(date)}
                disabled={!date?.from || !date?.to}
                className="w-full"
              >
                Apply
              </Button>
            </>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
