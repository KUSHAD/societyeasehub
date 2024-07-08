"use client";

import type PusherJs from "pusher-js";
import { createContext, useEffect, type ReactNode } from "react";
import { pusher } from "~/lib/pusher";
import { api } from "~/trpc/react";

const RealtimeContext = createContext<{
  pusher: PusherJs;
}>({
  pusher: pusher,
});

export default function PusherReactClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const utils = api.useUtils();

  useEffect(() => {
    const channel = pusher
      .subscribe("private-subs")
      .bind("mutation-event", async () => {
        await utils.invalidate();
      });

    return () => {
      channel.unbind();
    };
  }, [pusher]);

  return (
    <RealtimeContext.Provider value={{ pusher }}>
      {children}
    </RealtimeContext.Provider>
  );
}
