"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { createStripeURL } from "~/actions/subscription";
import { toast } from "../ui/use-toast";

export default function BillingPortalButton() {
  const [isPending, startTransition] = useTransition();

  const onBillingPortal = () => {
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
    <Button disabled={isPending} onClick={onBillingPortal} className="w-full">
      Go to Billing Portal
    </Button>
  );
}
