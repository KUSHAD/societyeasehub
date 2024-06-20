"use client";

import { Download } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function ExportTransactionButton() {
  return (
    <Button className="mx-2" variant="outline">
      <Download className="mx-2" /> Export
    </Button>
  );
}
