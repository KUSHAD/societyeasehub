"use client";

import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import useConfirm from "~/hooks/use-confirm";
import { financePayeeSchema } from "~/lib/validators/financePayee";
import { api } from "~/trpc/react";

export default function EditPayeeSheet(props: {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<boolean>;
}) {
  const { societyId } = useParams<{ societyId: string }>();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "You are going to delete this payee",
  );

  const utils = api.useUtils();

  const { mutate: update, isPending: updating } =
    api.financePayee.update.useMutation({
      async onSuccess() {
        await utils.financePayee.getBySociety.invalidate({
          societyId,
        });

        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        await utils.financeSummary.get.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Payee Updated",
        });
      },
    });

  const { mutate: remove, isPending: deleting } =
    api.financePayee.delete.useMutation({
      async onSuccess() {
        await utils.financePayee.getBySociety.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Payee Deleted",
        });
      },
    });

  const { data, isPending: getting } = api.financePayee.getById.useQuery({
    payeeId: props.id,
    societyId,
  });

  return (
    <>
      <ConfirmDialog />
      <Sheet open={props.isOpen} onOpenChange={() => props.setIsOpen(false)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
          </SheetHeader>
          <AutoForm
            onSubmit={(data) =>
              update({
                ...data,
                societyId,
                payeeId: props.id,
              })
            }
            formSchema={financePayeeSchema}
            values={
              getting
                ? undefined
                : data && {
                    ...data,
                    email: data.email ?? "",
                    phoneNumber: data.phoneNumber ?? "",
                    notes: data.notes ?? "",
                    identity: data.identity ?? "",
                    address: data.address ?? "",
                  }
            }
            fieldConfig={{
              address: {
                inputProps: {
                  className: "resize-none",
                },
                fieldType: "textarea",
              },
              notes: {
                inputProps: {
                  className: "resize-none",
                  placeholder: "Optional notes",
                },
                fieldType: "textarea",
              },
              phoneNumber: {
                inputProps: {
                  type: "tel",
                },
              },
              identity: {
                description: "Aadhar card or Pan Card Number",
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
                    payeeId: [props.id],
                    societyId,
                  });
                }
              }}
              disabled={updating || deleting}
              className="my-2 w-full"
              variant="destructive"
            >
              <Trash /> Delete Payee
            </Button>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
