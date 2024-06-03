"use client";

import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
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
import useConfirm from "~/hooks/use-confirm";
import { api } from "~/trpc/react";

export default function EditAccountSheet(props: {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<boolean>;
}) {
  const { societyId } = useParams<{ societyId: string }>();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "You are going to delete this account",
  );

  const utils = api.useUtils();

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
      },
    });

  const { data, isLoading: getting } = api.transactionAccounts.getById.useQuery(
    {
      accountId: props.id,
      societyId,
    },
  );

  return (
    <>
      <ConfirmDialog />
      <Sheet open={props.isOpen} onOpenChange={() => props.setIsOpen(false)}>
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
              update({
                name: data.name,
                societyId,
                accountId: props.id,
              })
            }
            formSchema={z.object({
              name: z
                .string()
                .min(1, "Required")
                .max(100, "Max 100 Characters"),
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
            <AutoFormSubmit className="w-full" disabled={updating || deleting}>
              Update
            </AutoFormSubmit>
          </AutoForm>
          {props.id && (
            <Button
              onClick={async () => {
                const ok = await confirm();
                if (ok) {
                  remove({
                    accountId: [props.id],
                    societyId,
                  });
                }
              }}
              disabled={updating || deleting}
              className="my-2 w-full"
              variant="destructive"
            >
              <Trash /> Delete Account
            </Button>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
