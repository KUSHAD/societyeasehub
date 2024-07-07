"use client";

import * as Sentry from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function createWidget() {
  return Sentry.getFeedback()?.createWidget();
}

function useFeedbackWidget(shouldMount: boolean) {
  const [widget, setWidget] = useState<ReturnType<typeof createWidget> | null>(
    null,
  );
  useEffect(() => {
    // Mount if true and no widget exists
    if (shouldMount && !widget) {
      const newWidget = createWidget();
      setWidget(newWidget);
    }

    // Unmount if false and widget exists
    if (!shouldMount && widget) {
      widget.removeFromDom();
      setWidget(null);
    }
  }, [shouldMount, widget]);
}

export default function SentryFeedbackWidget() {
  const session = useSession();
  useFeedbackWidget(session.status === "authenticated");

  return null;
}
