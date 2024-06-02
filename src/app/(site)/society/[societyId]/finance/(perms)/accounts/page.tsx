"use client";

import { Plus } from "lucide-react";
import AccountSheet from "~/components/society/finance/AccountSheet";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useNewAccountSheetStore } from "~/store/finance/newAccountSheet";
import { columns, payments } from "./columns";
import { DataTable } from "~/components/ui/data-table";

export default function Page() {
  const newAccountSheetStore = useNewAccountSheetStore();

  return (
    <>
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Accounts</CardTitle>
          <Button size="sm" onClick={newAccountSheetStore.onOpen}>
            <Plus className="mr-2 size-4" /> Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="email"
            columns={columns}
            data={payments}
            onDelete={() => {
              console.log(`hi`);
            }}
          />
        </CardContent>
      </Card>
      <AccountSheet />
    </>
  );
}
