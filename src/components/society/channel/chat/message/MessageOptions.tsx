import { ChevronDown, PenBoxIcon, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface MessageOptionsProps {
  self?: boolean;
}

export default function MessageOptions({ self }: MessageOptionsProps) {
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
        {!!self && (
          <DropdownMenuItem>
            <PenBoxIcon />
            Edit
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
