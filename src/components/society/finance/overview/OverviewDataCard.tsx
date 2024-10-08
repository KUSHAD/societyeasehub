"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { type IconType } from "react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { CountUp } from "~/components/ui/count-up";
import { Skeleton } from "~/components/ui/skeleton";

import { cn, formatCurrency, formatPercentage } from "~/lib/utils";

const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-primary/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-amber-500/20",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-primary",
      success: "fill-emerald-500",
      danger: "fill-rose-500",
      warning: "fill-amber-500",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface OverviewDataCardProps extends BoxVariants, IconVariants {
  title: string;
  value?: number;
  percentageChange?: number;
  icon: IconType;
}

export default function OverviewDataCard({
  icon: Icon,
  title,
  percentageChange = 0,
  value = 0,
  variant,
}: OverviewDataCardProps) {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-2xl">{title}</CardTitle>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="mb-2 line-clamp-1 break-all text-2xl font-bold">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimalPlaces={2}
            formattingFn={formatCurrency}
          />
        </h1>
        <p
          className={cn(
            "line-clamp-1 text-sm text-muted-foreground",
            percentageChange > 0 && "text-emerald-500",
            percentageChange < 0 && "text-rose-500",
          )}
        >
          {formatPercentage(percentageChange, { addPrefix: true })} from last
          period
        </p>
      </CardContent>
    </Card>
  );
}

export function OverviewDataCardLoading() {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
        </div>

        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-10 w-24 shrink-0" />
        <Skeleton className="h-4 w-40 shrink-0" />
      </CardContent>
    </Card>
  );
}
