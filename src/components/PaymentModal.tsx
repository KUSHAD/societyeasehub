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
import { toast } from "./ui/use-toast";

export default function PaymentModal() {
  const { mutate: createStripeSession, isLoading } =
    api.user.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        window.location.href = url ?? "/subscription";
        if (!url) {
          toast({
            title: "There was a problem...",
            description: "Please try again in a moment",
            variant: "destructive",
          });
        }
      },
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
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
        <Button
          disabled={isLoading}
          className="w-full"
          onClick={() => createStripeSession()}
        >
          Checkout to Payment
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
