"use client";

import { useParams } from "next/navigation";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "~/components/ui/use-toast";
import { integrationSchema } from "~/lib/validators/integration";
import { api } from "~/trpc/react";

export default function SocietyIntegrationPerms() {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { data: perms, isPending } = api.integration.getSocietyPerms.useQuery({
    societyId,
  });

  const { mutate: update, isPending: updating } =
    api.integration.updateSocietyPerms.useMutation({
      async onSuccess() {
        await utils.integration.getSocietyPerms.invalidate({ societyId });
        toast({
          title: "Message",
          description: "Integration Perms Updated",
        });
      },
    });

  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle>Integration Perms</CardTitle>
        <CardDescription>Features you allow to be integrated</CardDescription>
      </CardHeader>
      <CardContent>
        <AutoForm
          values={
            isPending
              ? {
                  integrateAnnouncements: false,
                  integrateRoadmaps: false,
                  integrateTransactions: false,
                }
              : perms
                ? {
                    integrateAnnouncements:
                      perms.integrateAnnouncements ?? undefined,
                    integrateRoadmaps: perms.integrateRoadmaps ?? undefined,
                    integrateTransactions:
                      perms.integrateTransactions ?? undefined,
                  }
                : undefined
          }
          onSubmit={(data) =>
            update({
              ...data,
              societyId,
            })
          }
          fieldConfig={{
            integrateAnnouncements: { fieldType: "switch" },
            integrateRoadmaps: { fieldType: "switch" },
            integrateTransactions: { fieldType: "switch" },
          }}
          formSchema={integrationSchema}
        >
          <CardFooter className="flex flex-row">
            <div className="mr-auto" />
            <AutoFormSubmit disabled={isPending || updating}>
              Update Perms
            </AutoFormSubmit>
          </CardFooter>
        </AutoForm>
      </CardContent>
    </Card>
  );
}
