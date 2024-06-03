"use client";

import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { z } from "zod";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function NewCategorySheet() {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { mutate: create, isLoading } =
    api.financeCategories.create.useMutation({
      async onSuccess() {
        await utils.financeCategories.getBySociety.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Category Created",
        });
      },
    });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" /> Add New
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>

          <SheetDescription>
            Create a new category to keep track of your transactions
          </SheetDescription>
        </SheetHeader>
        <AutoForm
          onSubmit={(data) =>
            create({
              name: data.name,
              societyId,
            })
          }
          formSchema={z.object({
            name: z.string().min(1, "Required").max(100, "Max 100 Characters"),
          })}
          fieldConfig={{
            name: {
              inputProps: {
                placeholder: "eg. Bank, Cash, Credit Card",
              },
            },
          }}
        >
          <AutoFormSubmit className="w-full" disabled={isLoading}>
            Create
          </AutoFormSubmit>
        </AutoForm>
      </SheetContent>
    </Sheet>
  );
}
