"use client";

import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { z } from "zod";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import { useNewAccountSheetStore } from "~/store/finance/newAccountSheet";
import { api } from "~/trpc/react";

export default function AccountSheet(props: { id?: string }) {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const newAccountSheetStore = useNewAccountSheetStore();

  const { mutate: create, isLoading } =
    api.transactionAccounts.create.useMutation({
      async onSuccess() {
        await utils.transactionAccounts.getBySociety.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Account Created",
        });

        newAccountSheetStore.onClose();
      },
    });

  const { mutate: update, isLoading: updating } =
    api.transactionAccounts.update.useMutation({
      async onSuccess() {
        await utils.transactionAccounts.getBySociety.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Account Updated",
        });
        newAccountSheetStore.onClose();
      },
    });

  const { mutate: remove, isLoading: deleting } =
    api.transactionAccounts.delete.useMutation({
      async onSuccess() {
        await utils.transactionAccounts.getBySociety.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Account Deleted",
        });

        newAccountSheetStore.onClose();
      },
    });

  const { data, isLoading: getting } = api.transactionAccounts.getById.useQuery(
    {
      accountId: props.id!,
      societyId,
    },
    { enabled: Boolean(props.id) },
  );

  return (
    <Sheet open={newAccountSheetStore.isOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{props.id ? "Update" : "New"}Account</SheetTitle>
          {props.id ? (
            <SheetDescription>
              Create a new account to keep track of your transactions
            </SheetDescription>
          ) : null}
        </SheetHeader>
        <AutoForm
          onSubmit={(data) =>
            props.id
              ? update({
                  name: data.name,
                  societyId,
                  accountId: props.id,
                })
              : create({
                  name: data.name,
                  societyId,
                })
          }
          formSchema={z.object({
            name: z.string().min(1, "Required").max(100, "Max 100 Characters"),
          })}
          values={{
            name: props.id ? (getting ? "" : data) : "",
          }}
          fieldConfig={{
            name: {
              inputProps: {
                placeholder: "eg. Bank, Cash, Credit Card",
              },
            },
          }}
        >
          <AutoFormSubmit
            className="w-full"
            disabled={isLoading || updating || deleting}
          >
            {props.id ? "Update" : "Create"}
          </AutoFormSubmit>
        </AutoForm>
        {props.id && (
          <Button
            onClick={() =>
              remove({
                accountId: props.id!,
                societyId,
              })
            }
            disabled={updating || isLoading || deleting}
            className="my-2 w-full"
            variant="destructive"
          >
            <Trash /> Delete Account
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
}
