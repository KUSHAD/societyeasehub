"use client";

import { useParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { transferOwnershipSchema } from "~/lib/validators/transferOwnership";
import { type z } from "zod";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PasswordInput } from "~/components/ui/password-input";
import { toast } from "~/components/ui/use-toast";

export default function TransferOwnershipForm() {
  const form = useForm<z.infer<typeof transferOwnershipSchema>>({
    resolver: zodResolver(transferOwnershipSchema),
    mode: "all",
    reValidateMode: "onChange",
  });

  const utils = api.useUtils();

  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  const { data: members, isLoading: gettingMembers } =
    api.member.getBySocietyWithoutOwner.useQuery({
      societyId: id,
    });

  const { mutate: transferOwnership, isLoading: isTransferring } =
    api.society.transferOwnership.useMutation({
      onSuccess: async () => {
        await utils.invalidate();
        toast({
          title: "Success",
          description: "Transferred",
        });
        router.push(`/society/${id}/feed`);
        router.refresh();
      },
    });

  function onSubmit(data: z.infer<typeof transferOwnershipSchema>) {
    transferOwnership({
      societyId: id,
      password: data.password,
      userId: data.transferringTo,
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Transfer Ownership</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Transfer Ownership</AlertDialogTitle>
        <AlertDialogDescription>
          Transfer Ownership of this society to one of your members
        </AlertDialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="transferringTo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transferring To</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                              members &&
                              members.find(
                                (_member) => _member.id === field.value,
                              )?.name
                            : "Choose Member"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Members..."
                          className="h-9"
                        />
                        <CommandEmpty>No Member found.</CommandEmpty>
                        <CommandGroup>
                          {
                            // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                            members &&
                              members.map((_member) => (
                                <CommandItem
                                  value={_member.id}
                                  key={_member.id}
                                  onSelect={() => {
                                    form.setValue("transferringTo", _member.id);
                                  }}
                                >
                                  <Avatar className="mx-2 h-[20px] w-[20px]">
                                    <AvatarImage src={_member.image} />
                                    <AvatarFallback>
                                      {_member.name.slice(0, 1)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {_member.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      _member.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))
                          }
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isTransferring}
              type="submit"
              className="my-2 w-full"
            >
              Transfer
            </Button>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isTransferring || gettingMembers}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
