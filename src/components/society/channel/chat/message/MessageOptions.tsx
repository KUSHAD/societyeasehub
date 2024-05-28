import { ChevronDown, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

interface MessageOptionsProps {
  self?: boolean;
  messageId: string;
}

export default function MessageOptions({
  self,
  messageId,
}: MessageOptionsProps) {
  const { societyId, channelId } = useParams<{
    societyId: string;
    channelId: string;
  }>();

  const utils = api.useUtils();

  const { isLoading: adminDeleting, mutate: adminDelete } =
    api.message.adminDelete.useMutation({
      async onSuccess() {
        await utils.message.getByChannel.invalidate({ channelId });
        toast({
          title: "Message",
          description: "Message Deleted",
        });
      },
    });

  const { isLoading: userDeleting, mutate: userDelete } =
    api.message.userDelete.useMutation({
      async onSuccess() {
        await utils.message.getByChannel.invalidate({ channelId });
        toast({
          title: "Message",
          description: "Message Deleted",
        });
      },
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={self ? "default" : "ghost"}
          className={self ? "text-muted" : "text-foreground"}
          size="icon"
        >
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute left-0  top-0">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuItem
          disabled={userDeleting || adminDeleting}
          onClick={() =>
            self
              ? userDelete({
                  messageId,
                })
              : adminDelete({
                  messageId,
                  societyId,
                })
          }
        >
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
