"use client";

import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
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
import { financePayeeSchema } from "~/lib/validators/financePayee";
import { api } from "~/trpc/react";

export default function NewPayeeSheet() {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { mutate: create, isLoading } = api.financePayee.create.useMutation({
    async onSuccess() {
      await utils.financePayee.getBySociety.invalidate({
        societyId,
      });

      await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
        societyId,
      });

      toast({
        title: "Message",
        description: "Payee Created",
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
      <SheetContent side="right" className="overflow-auto">
        <SheetHeader>
          <SheetTitle>New Payee</SheetTitle>
          <SheetDescription>
            Create a new payee to keep track of your transactions
          </SheetDescription>
        </SheetHeader>
        <AutoForm
          onSubmit={(data) =>
            create({
              ...data,
              societyId,
            })
          }
          formSchema={financePayeeSchema}
          fieldConfig={{
            address: {
              inputProps: {
                className: "resize-none",
              },
              fieldType: "textarea",
            },
            notes: {
              inputProps: {
                className: "resize-none",
                placeholder: "Optional notes",
              },
              fieldType: "textarea",
            },
            phoneNumber: {
              inputProps: {
                type: "tel",
              },
            },
            identity: {
              description: "Aadhar card or Pan Card Number",
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
