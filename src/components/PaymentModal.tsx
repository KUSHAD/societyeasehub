"use client";

import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export default function PaymentModal() {
  const { mutate: createStripeSession } =
    api.user.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        window.location.href = url ?? "/subscription";
      },
    });
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Payment</AlertDialogTitle>
          <AlertDialogDescription>
            This payment is required to continue using the platform
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button className="w-full" onClick={() => createStripeSession()}>
          Checkout to Payment
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
