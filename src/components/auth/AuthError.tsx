"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "../ui/use-toast";
import { getAuthErrors } from "~/lib/utils";

export default function AuthError() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const errCode = searchParams.get("error");
    if (errCode) {
      const message = getAuthErrors(errCode);

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  }, [searchParams]);

  return null;
}
