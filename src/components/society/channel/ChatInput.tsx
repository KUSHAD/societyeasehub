"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { File, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import ResizableTextarea from "~/components/ui/resizeable-textarea";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { messageSchema } from "~/lib/validators/message";
import { api } from "~/trpc/react";

export default function ChatInput() {
  const utils = api.useUtils();
  const { channelId, id } = useParams<{ channelId: string; id: string }>();
  const { mutate: create, isLoading: isSending } =
    api.message.create.useMutation({
      onSuccess: async () => {
        await utils.message.getByChannel.invalidate({ channelId });
        await utils.message.getCountByChannel.invalidate({ channelId });
      },
    });
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    mode: "all",
    reValidateMode: "onChange",
  });
  const { isLoading, data: count } = api.message.getCountByChannel.useQuery({
    channelId,
  });

  const onSubmit = (data: z.infer<typeof messageSchema>) => {
    create({
      ...data,
      channelId,
      societyId: id,
    });
    form.reset();
  };

  return isLoading ? (
    <Skeleton className="absolute bottom-1 z-40 h-[60px] w-full max-w-2xl" />
  ) : (
    <Form {...form}>
      <div
        className={cn(
          "bottom-1 z-40 w-full max-w-2xl",
          count && count === 0 ? "sticky" : "absolute",
        )}
      >
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
                    className="w-[90%] bg-secondary"
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
