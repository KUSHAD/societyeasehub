"use client";

import { useParams } from "next/navigation";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { type AutoFormInputComponentProps } from "~/components/ui/auto-form/types";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CreatableSelect } from "~/components/ui/creatable-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import { financeTransactionSchema } from "~/lib/validators/financeTransaction";
import { api } from "~/trpc/react";
import CurrencyInput from "~/components/ui/currency-input";
import {
  convertAmountFromMiliUnits,
  convertAmountToMiliUnits,
} from "~/lib/utils";
import useConfirm from "~/hooks/use-confirm";
import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function EditTransactionSheet(props: {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<boolean>;
}) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "You are going to delete this transaction",
  );

  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { mutate: update, isLoading: updating } =
    api.financeTransaction.update.useMutation({
      async onSuccess() {
        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Transaction Updated",
        });
      },
    });

  const { data: payees, isLoading: gettingPayees } =
    api.financePayee.getBySociety.useQuery({
      societyId,
    });

  const { mutate: createPayee, isLoading: payeeCreating } =
    api.financePayee.create.useMutation({
      async onSuccess() {
        await utils.financePayee.getBySociety.invalidate({
          societyId,
        });

        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Payee Created",
        });
      },
    });

  const { mutate: remove, isLoading: deleting } =
    api.financeTransaction.delete.useMutation({
      async onSuccess() {
        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Category Deleted",
        });
      },
    });

  const { data, isLoading: getting } = api.financeTransaction.getById.useQuery({
    societyId,
    transactionId: props.id,
  });

  const { data: categories, isLoading: gettingCategories } =
    api.financeCategories.getBySociety.useQuery({
      societyId,
    });

  const { data: accounts, isLoading: gettingAccounts } =
    api.financeAccounts.getBySociety.useQuery({
      societyId,
    });

  const { mutate: createAccount, isLoading: accountCreating } =
    api.financeAccounts.create.useMutation({
      async onSuccess() {
        await utils.financeAccounts.getBySociety.invalidate({
          societyId,
        });

        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Account Created",
        });
      },
    });

  const { mutate: createCategory, isLoading: categoryCreating } =
    api.financeCategories.create.useMutation({
      async onSuccess() {
        await utils.financeCategories.getBySociety.invalidate({
          societyId,
        });

        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Category Created",
        });
      },
    });

  return (
    <>
      <ConfirmDialog />
      <Sheet open={props.isOpen} onOpenChange={() => props.setIsOpen(false)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
          </SheetHeader>
          <AutoForm
            values={
              getting
                ? undefined
                : data && {
                    ...data,
                    categoryId: data.categoryId ?? undefined,
                    notes: data.notes ?? undefined,
                    amount: convertAmountFromMiliUnits(data.amount),
                  }
            }
            onSubmit={(data) => {
              const amountInMiliUnits = convertAmountToMiliUnits(data.amount);
              update({
                ...data,
                societyId,
                amount: amountInMiliUnits,
                transactionId: props.id,
              });
            }}
            formSchema={financeTransactionSchema}
            fieldConfig={{
              categoryId: {
                fieldType: ({
                  label,
                  isRequired,
                  field,
                  fieldConfigItem,
                }: AutoFormInputComponentProps) => (
                  <FormItem>
                    <FormLabel>
                      {label}
                      {isRequired && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <CreatableSelect
                        {...field}
                        options={
                          categories?.map((_c) => ({
                            label: _c.name,
                            value: _c.id,
                          })) ?? []
                        }
                        onCreate={(name) =>
                          createCategory({
                            name: name!,
                            societyId,
                          })
                        }
                      />
                    </FormControl>
                    {fieldConfigItem.description && (
                      <FormDescription>
                        {fieldConfigItem.description}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                ),
              },
              accountId: {
                fieldType: ({
                  label,
                  isRequired,
                  field,
                  fieldConfigItem,
                }: AutoFormInputComponentProps) => (
                  <FormItem>
                    <FormLabel>
                      {label}
                      {isRequired && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <CreatableSelect
                        {...field}
                        options={
                          accounts?.map((_c) => ({
                            label: _c.name,
                            value: _c.id,
                          })) ?? []
                        }
                        onCreate={(name) =>
                          createAccount({
                            name: name!,
                            societyId,
                          })
                        }
                      />
                    </FormControl>
                    {fieldConfigItem.description && (
                      <FormDescription>
                        {fieldConfigItem.description}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                ),
              },
              payeeId: {
                fieldType: ({
                  label,
                  isRequired,
                  field,
                  fieldConfigItem,
                }: AutoFormInputComponentProps) => (
                  <FormItem>
                    <FormLabel>
                      {label}
                      {isRequired && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <CreatableSelect
                        {...field}
                        options={
                          payees?.map((_p) => ({
                            label: _p.name,
                            value: _p.id,
                          })) ?? []
                        }
                        onCreate={(name) =>
                          createPayee({
                            name: name!,
                            societyId,
                          })
                        }
                      />
                    </FormControl>
                    {fieldConfigItem.description && (
                      <FormDescription>
                        {fieldConfigItem.description}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                ),
              },
              notes: {
                fieldType: "textarea",
                inputProps: {
                  className: "resize-none",
                  placeholder: "Optional notes",
                },
              },
              amount: {
                fieldType: ({
                  label,
                  isRequired,
                  field,
                  fieldConfigItem,
                }: AutoFormInputComponentProps) => (
                  <FormItem>
                    <FormLabel>
                      {label}
                      {isRequired && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <CurrencyInput {...field} />
                    </FormControl>
                    {fieldConfigItem.description && (
                      <FormDescription>
                        {fieldConfigItem.description}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                ),
              },
            }}
          >
            <AutoFormSubmit
              className="w-full"
              disabled={
                updating ||
                gettingCategories ||
                gettingAccounts ||
                accountCreating ||
                categoryCreating ||
                payeeCreating ||
                gettingPayees
              }
            >
              Update
            </AutoFormSubmit>
          </AutoForm>
          {props.id && (
            <Button
              onClick={async () => {
                const ok = await confirm();
                if (ok) {
                  remove({
                    transactionId: [props.id],
                    societyId,
                  });
                }
              }}
              disabled={updating || deleting}
              className="my-2 w-full"
              variant="destructive"
            >
              <Trash /> Delete Transaction
            </Button>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
