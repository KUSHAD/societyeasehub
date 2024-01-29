"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";
import { toast } from "~/components/ui/use-toast";
import { type TRPCClientErrorType } from "~/lib/types";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000, // 5 seconds
            refetchInterval: 5 * 1000, // 5 seconds
            retry: (failureCount) => failureCount <= 3,
            retryDelay: 500,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onError(err: TRPCClientErrorType) {
              toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
              });
            },
          },
          mutations: {
            retry: (failureCount) => failureCount <= 3,
            retryDelay: 500,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onError(err: TRPCClientErrorType) {
              toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
              });
            },
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            return {
              cookie: props.cookies,
              "x-trpc-source": "react",
            };
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
