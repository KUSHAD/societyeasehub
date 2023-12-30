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
import SettingsDrawerContents from "./SettingsDrawerContents";

export default function SettingsMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <PanelLeftOpen />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Navigate through the Settings </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col">
          <SettingsDrawerContents />
        </div>
      </SheetContent>
    </Sheet>
  );
}
