"use client";

import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export default function ShowBillingButton() {
  const { mutate: createBillingPortal, isLoading } =
    api.user.createBillingPortal.useMutation({
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
    <Button
      disabled={isLoading}
      onClick={() => createBillingPortal()}
      className="w-full"
    >
      See Your Billing Portal
    </Button>
  );
}
