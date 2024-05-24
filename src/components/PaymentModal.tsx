"use client";

import { signOut, useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { createStripeURL } from "~/actions/subscription";
import { toast } from "./ui/use-toast";

export default function PaymentModal() {
  const { data } = useSession();
  const [isPending, startTransition] = useTransition();

  const onPayment = () => {
    startTransition(() => {
      createStripeURL()
        .then((res) => {
          if (res.data) {
            // eslint-disable-next-line react-compiler/react-compiler
            window.location.href = res.data;
          }
        })
        .catch((err: { message: string }) =>
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          }),
        );
    });
  };

  return (
    <AlertDialog open defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Payment</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Kindly proceed for the subscription to use this app
        </AlertDialogDescription>
        <Button
          disabled={isPending}
          onClick={onPayment}
          className="my-2 w-full"
        >
          Proceed to payment
        </Button>
        <span className="text-center text-gray-500">
          Currently logged in as{" "}
          <em
            className="cursor-pointer hover:underline"
            onClick={() => signOut()}
          >
            {data?.user?.email}
          </em>
        </span>
      </AlertDialogContent>
    </AlertDialog>
  );
}
