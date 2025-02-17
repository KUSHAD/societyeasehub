import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "~/components/ui/use-toast";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client

        retry: (failureCount) => failureCount <= 3,
        retryDelay: 500,
        notifyOnChangeProps: "all",
        networkMode: "online",
        staleTime: 30 * 1000,
      },
      mutations: {
        retry: (failureCount) => failureCount <= 3,
        retryDelay: 500,
        networkMode: "online",
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
    queryCache: new QueryCache({}),
    mutationCache: new MutationCache({
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    }),
  });
