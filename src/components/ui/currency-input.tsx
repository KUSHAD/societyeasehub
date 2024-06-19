"use client";

import CurrencyInputPrimitive from "react-currency-input-field";

import { Info, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CurrencyInput({
  onChange,
  value,
  disabled,
  placeholder,
}: CurrencyInputProps) {
  const parsedValue = parseFloat(value);

  const isIncome = parsedValue > 0;
  const isExpenditure = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;

    const newValue = parseFloat(value) * -1;
    onChange(newValue.toString());
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReverseValue}
              className={cn(
                "absolute left-1 top-1 flex items-center justify-center rounded-md  p-2 transition ",
                !parsedValue && "bg-slate-400 hover:bg-slate-500",
                isIncome && "bg-green-400 hover:bg-green-500",
                isExpenditure && "bg-red-400 hover:bg-red-500",
              )}
            >
              {!parsedValue && <Info className="size-3 text-white" />}
              {isIncome && <PlusCircle className="size-3 text-white" />}
              {isExpenditure && <MinusCircle className="size-3 text-white" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Use [+] for Income and [-] for Expenditure
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInputPrimitive
        onValueChange={onChange}
        prefix="₹"
        value={value}
        placeholder={placeholder}
        allowDecimals
        decimalsLimit={2}
        decimalScale={2}
        disabled={disabled}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="text-xs text-foreground">
        {isIncome && "This will be considered as income"}
        {isExpenditure && "This will be considered as expendenditure"}
      </div>
    </div>
  );
}
