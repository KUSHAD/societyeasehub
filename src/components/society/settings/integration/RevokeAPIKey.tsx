"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import NotFound from "~/components/NotFound";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function RevokeAPIKey() {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { data: apiKeys, isPending } = api.integration.getAPIKeys.useQuery({
    societyId,
  });

  const { mutate: revoke, isPending: revoking } =
    api.integration.revokeAPIKey.useMutation({
      async onSuccess() {
        await utils.integration.getAPIKeys.invalidate({ societyId });

        toast({
          title: "Message",
          description: "Revoked API Key",
        });
      },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revoke API Key</CardTitle>
        <CardDescription>
          Revoking an API Key will remove accessing the integrations using that
          key
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="my-2 h-[40px] w-full" count={5} />
        ) : apiKeys && apiKeys.length !== 0 ? (
          apiKeys.map((_key) => (
            <div key={_key.key} className="my-2 flex flex-row">
              <strong className="mr-auto">{_key.key}</strong>
              <Button
                disabled={revoking}
                onClick={() => revoke({ apiKey: _key.key, societyId })}
                variant="destructive"
              >
                Revoke
              </Button>
            </div>
          ))
        ) : (
          <NotFound
            message="No API Keys Found"
            description="Create a new API Key and View them here"
          />
        )}
      </CardContent>
    </Card>
  );
}
