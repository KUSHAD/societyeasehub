"use client";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "~/lib/validators/message";
import { api } from "~/trpc/react";
import { type z } from "zod";
import ChatAttachment from "./ChatAttachment";
import { useMessageStore } from "~/store/message";
import { useMessageAttachmentStore } from "~/store/messageAttachment";

export default function ChatInput() {
  const messageStore = useMessageStore();
  const messageAttachmentStore = useMessageAttachmentStore();
  const utils = api.useUtils();
  const { channelId, id } = useParams<{ channelId: string; id: string }>();
  const { mutate: create, isLoading: isSending } =
    api.message.create.useMutation({
      onSuccess: async () => {
        await utils.message.getByChannel.invalidate({ channelId });
        form.reset();
        messageStore.updateByChannel(channelId, "");
        messageAttachmentStore.clearByChannel(channelId);
      },
    });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      content: messageStore.getByChannel(channelId),
    },
  });

  const onSubmit = (data: z.infer<typeof messageSchema>) => {
    create({
      ...data,
      channelId,
      societyId: id,
      attachments: messageAttachmentStore.getByChannel(channelId),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-row items-stretch"
      >
        <ChatAttachment />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input
                  maxLength={200}
                  disabled={isSending}
                  minLength={1}
                  placeholder="Type Something ..."
                  className="w-3/4 bg-secondary sm:w-[90%] lg:w-[93%]"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    messageStore.updateByChannel(channelId, e.target.value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          disabled={
            isSending ||
            (!form.getValues("content") &&
              messageAttachmentStore.getByChannel(channelId).length === 0)
          }
          type="submit"
          className="absolute right-0 top-0 rounded-full"
          size="icon"
        >
          <Send className="p-1" />
        </Button>
      </form>
    </Form>
  );
}
