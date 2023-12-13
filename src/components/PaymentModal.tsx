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
import { signOut, useSession } from "next-auth/react";

export default function PaymentModal() {
  const { data } = useSession();
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
          className="my-2 w-full"
          onClick={() => createStripeSession()}
        >
          Checkout to Payment
        </Button>
        <Button
          variant="outline"
          onClick={() => signOut()}
          disabled={isLoading}
          className="w-full"
        >
          Use a Different Account
        </Button>
        <p className="text-center text-neutral-500">
          Current Logged in as{" "}
          <span
            onClick={() => signOut()}
            className="cursor-pointer hover:underline"
          >
            {data?.user.email}
          </span>
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
}
