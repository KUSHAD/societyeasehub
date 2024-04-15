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
import FeedDrawer from "./FeedDrawer";

export default function FeedMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <PanelLeftOpen />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Feed</SheetTitle>
          <SheetDescription>Navigate through the Feed</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col">
          <FeedDrawer />
        </div>
      </SheetContent>
    </Sheet>
  );
}
