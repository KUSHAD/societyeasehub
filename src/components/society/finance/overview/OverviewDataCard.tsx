"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { type IconType } from "react-icons";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

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
  dateRange: string;
  icon: IconType;
}

export default function OverviewDataCard({
  dateRange,
  icon: Icon,
  title,
  defaultVariants,
  percentageChange = 0,
  value = 0,
  variant,
}: OverviewDataCardProps) {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-2xl">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
    </Card>
  );
}
