"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { File, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import ResizableTextarea from "~/components/ui/resizeable-textarea";
import { messageSchema } from "~/lib/validators/message";
import { api } from "~/trpc/react";

export default function ChatInput() {
  const utils = api.useUtils();
  const { channelId, id } = useParams<{ channelId: string; id: string }>();
  const { mutate: create, isLoading: isSending } =
    api.message.create.useMutation({
      onSuccess: async () => {
        await utils.message.getByChannel.invalidate({ channelId });
      },
    });
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: z.infer<typeof messageSchema>) => {
    create({
      ...data,
      channelId,
      societyId: id,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ResizableTextarea
                    maxLength={500}
                    disabled={isSending}
                    minLength={1}
                    placeholder="Type Something ..."
                    className="bg-secondaryz w-[90%]"
                    onMessageSubmit={(content) =>
                      onSubmit({ content: content })
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.getValues("content") ? (
            <Button
              disabled={isSending}
              type="submit"
              className="absolute right-0 top-3 rounded-full"
              size="icon"
            >
              <Send className="p-1" />
            </Button>
          ) : (
            <Button
              type="button"
              className="absolute right-0 top-3 rounded-full"
              size="icon"
              variant="outline"
            >
              <File className="p-1" />
            </Button>
          )}
        </form>
      </div>
    </Form>
  );
}
