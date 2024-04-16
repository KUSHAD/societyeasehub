"use client";

import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { transactionSchema } from "~/lib/validators/transaction";
import { api } from "~/trpc/react";

export default function AddTransactionForm() {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();

  const { isLoading, mutate: create } = api.transaction.create.useMutation({
    async onSuccess() {
      await utils.transaction.invalidate();
      toast({
        title: "Message",
        description: "Transaction Created",
      });
    },
  });
  return (
    <>
      <div className="flex flex-row">
        <div className="mr-auto" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <Plus className="mx-1" /> Add Transaction
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Transaction</AlertDialogTitle>
            </AlertDialogHeader>
            <AutoForm
              onSubmit={(data) =>
                create({
                  ...data,
                  societyId: id,
                })
              }
              formSchema={transactionSchema}
              fieldConfig={{
                description: {
                  fieldType: "textarea",
                  inputProps: {
                    className: "resize-none",
                  },
                },
              }}
            >
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Close
                </AlertDialogCancel>
                <AutoFormSubmit disabled={isLoading}>Create</AutoFormSubmit>
              </AlertDialogFooter>
            </AutoForm>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
