"use client";

import { PanelLeftOpen } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import FinanceDrawer from "./FinanceDrawer";

export default function FinanceMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <PanelLeftOpen />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Finance</SheetTitle>
          <SheetDescription>Navigate through the Finance</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col">
          <FinanceDrawer />
        </div>
      </SheetContent>
    </Sheet>
  );
}
