/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type SupabaseClient } from "@supabase/supabase-js";
import { createContext, useEffect } from "react";
import { supabase } from "~/lib/supabase";
import { api } from "~/trpc/react";

const RealtimeContext = createContext<{
  supabase: SupabaseClient<any, "public", any>;
}>({
  supabase: supabase,
});
export function SupabaseRealtimeReactProvider(props: {
  children: React.ReactNode;
}) {
  const utils = api.useUtils();

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async () => {
          await utils.invalidate();
        },
      )
      .subscribe();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <RealtimeContext.Provider
      value={{
        supabase,
      }}
    >
      {props.children}
    </RealtimeContext.Provider>
  );
}
