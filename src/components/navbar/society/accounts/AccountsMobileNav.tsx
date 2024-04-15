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
import AccountsDrawer from "./AccountsDrawer";

export default function AccountsMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <PanelLeftOpen />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Accounts</SheetTitle>
          <SheetDescription>Navigate through the Accounts</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col">
          <AccountsDrawer />
        </div>
      </SheetContent>
    </Sheet>
  );
}
