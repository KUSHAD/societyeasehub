"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import NotFound from "~/components/NotFound";
import { Button } from "~/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NotFound message="Something Went Wrong" description={error.message}>
          <span>{error.digest}</span>
          <Button onClick={reset}>Retry</Button>
        </NotFound>
      </body>
    </html>
  );
}
