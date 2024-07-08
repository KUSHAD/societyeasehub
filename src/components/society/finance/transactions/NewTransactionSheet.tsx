"use client";

import { Plus } from "lucide-react";
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
import { Button } from "~/components/ui/button";
import { CreatableSelect } from "~/components/ui/creatable-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import { financeTransactionSchema } from "~/lib/validators/financeTransaction";
import { api } from "~/trpc/react";
import CurrencyInput from "~/components/ui/currency-input";
import { convertAmountToMiliUnits } from "~/lib/utils";

export default function NewTransactionSheet() {
  const { societyId } = useParams<{ societyId: string }>();

  const utils = api.useUtils();

  const { mutate: create, isPending } =
    api.financeTransaction.create.useMutation({
      async onSuccess() {
        await utils.financeTransaction.getBySocietyAndAccounts.invalidate({
          societyId,
        });

        toast({
          title: "Message",
          description: "Transaction Created",
        });
      },
    });

  const { data: categories, isPending: gettingCategories } =
    api.financeCategories.getBySociety.useQuery({
      societyId,
    });

  const { data: accounts, isPending: gettingAccounts } =
    api.financeAccounts.getBySociety.useQuery({
      societyId,
    });

  const { data: payees, isPending: gettingPayees } =
    api.financePayee.getBySociety.useQuery({
      societyId,
    });

  const { mutate: createPayee, isPending: payeeCreating } =
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

  const { mutate: createAccount, isPending: accountCreating } =
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

  const { mutate: createCategory, isPending: categoryCreating } =
    api.financeCategories.create.useMutation({
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
          description: "Category Created",
        });
      },
    });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" /> Add New
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
        </SheetHeader>
        <AutoForm
          onSubmit={(data) => {
            const amountInMiliUnits = convertAmountToMiliUnits(data.amount);
            create({
              ...data,
              societyId,
              amount: amountInMiliUnits,
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
                    {isRequired && <span className="text-destructive">*</span>}
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
                    {isRequired && <span className="text-destructive">*</span>}
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
                    {isRequired && <span className="text-destructive">*</span>}
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
                    {isRequired && <span className="text-destructive">*</span>}
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
              isPending ||
              gettingCategories ||
              gettingAccounts ||
              accountCreating ||
              categoryCreating ||
              gettingPayees ||
              payeeCreating
            }
          >
            Create
          </AutoFormSubmit>
        </AutoForm>
      </SheetContent>
    </Sheet>
  );
}
