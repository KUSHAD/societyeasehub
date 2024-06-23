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
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import useConfirm from "~/hooks/use-confirm";
import { api } from "~/trpc/react";

export default function EditCategorySheet(props: {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<boolean>;
}) {
  const { societyId } = useParams<{ societyId: string }>();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "You are going to delete this category",
  );

  const utils = api.useUtils();

  const { mutate: update, isLoading: updating } =
    api.financeCategories.update.useMutation({
      async onSuccess() {
        await utils.financeCategories.getBySociety.invalidate({
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
          description: "Category Updated",
        });
      },
    });

  const { mutate: remove, isLoading: deleting } =
    api.financeCategories.delete.useMutation({
      async onSuccess() {
        await utils.financeCategories.getBySociety.invalidate({
          societyId,
        });

        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Category Deleted",
        });
      },
    });

  const { data, isLoading: getting } = api.financeCategories.getById.useQuery({
    categoryId: props.id,
    societyId,
  });

  return (
    <>
      <ConfirmDialog />
      <Sheet open={props.isOpen} onOpenChange={() => props.setIsOpen(false)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Update Category</SheetTitle>
          </SheetHeader>
          <AutoForm
            onSubmit={(data) =>
              update({
                name: data.name,
                societyId,
                categoryId: props.id,
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
                  placeholder: "eg. Food, Travel, etc.",
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
                    categoryId: [props.id],
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
