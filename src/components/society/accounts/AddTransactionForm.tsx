"use client";

import { Plus } from "lucide-react";
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
import { transactionSchema } from "~/lib/validators/transaction";

export default function AddTransactionForm() {
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
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AutoFormSubmit>Create</AutoFormSubmit>
              </AlertDialogFooter>
            </AutoForm>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
