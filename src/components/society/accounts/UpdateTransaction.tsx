"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { type TransactionActionProps } from "./TransactionAction";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { transactionSchema } from "~/lib/validators/transaction";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { useParams } from "next/navigation";

export default function UpdateTransaction({
  transaction,
}: TransactionActionProps) {
  const { id } = useParams<{ id: string }>();

  const utils = api.useUtils();

  const { mutate: update, isLoading } = api.transaction.update.useMutation({
    async onSuccess() {
      await utils.transaction.invalidate();

      toast({
        title: "Message",
        description: "Transaction Updated",
      });
    },
  });
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Update Transaction</AlertDialogTitle>
      </AlertDialogHeader>
      <AutoForm
        formSchema={transactionSchema}
        values={{
          amount: transaction.amount,
          date: new Date(transaction.date),
          description: transaction.description ?? "",
          type: transaction.type,
        }}
        onSubmit={(data) =>
          update({
            ...data,
            societyId: id,
            transactionId: transaction.id,
          })
        }
      >
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AutoFormSubmit disabled={isLoading}>Update</AutoFormSubmit>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AutoForm>
    </>
  );
}
