"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import NotFound from "~/components/NotFound";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "~/components/ui/use-toast";
import { useAPIKeyStore } from "~/store/apiKey";
import { api } from "~/trpc/react";

export default function APIKeyChooser() {
  const { societyId } = useParams<{ societyId: string }>();
  const { setAPIKey, getAPIKey } = useAPIKeyStore();

  const [selectedKey, setSelectedKey] = useState(getAPIKey(societyId));

  const utils = api.useUtils();

  const { data: apiKeys, isPending } = api.integration.getAPIKeys.useQuery({
    societyId,
  });

  const { mutate: create, isPending: creating } =
    api.integration.createAPIKey.useMutation({
      async onSuccess(data) {
        setAPIKey(data.key, societyId);

        await utils.integration.getAPIKeys.invalidate({ societyId });

        toast({
          title: "Message",
          description: "Created New API Key",
        });
      },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-[40px] w-full" />
        ) : apiKeys && apiKeys.length !== 0 ? (
          <Select
            disabled={creating || isPending}
            value={selectedKey ?? ""}
            onValueChange={(value) => setSelectedKey(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an API Key" />
            </SelectTrigger>
            <SelectContent>
              {apiKeys.map((_apiKey) => (
                <SelectItem value={_apiKey.key}>{_apiKey.key}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <NotFound
            message="No API Keys Found"
            description="Create a new API Key and View them here"
          />
        )}
      </CardContent>
      <CardFooter className="flx-row flex">
        <div className="mr-auto" />
        <Button
          onClick={() => {
            create({
              societyId,
            });
          }}
          className="mx-2"
          disabled={creating || isPending}
          variant="outline"
        >
          Generate New API Key
        </Button>
        <Button
          onClick={() => {
            setAPIKey(selectedKey, societyId);
            toast({
              title: "Message",
              description: "API Key Set",
            });
          }}
          disabled={creating || isPending || !selectedKey}
          className="mx-2"
        >
          Set API Key
        </Button>
      </CardFooter>
    </Card>
  );
}
