"use client";

import { ChevronLeft, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, buttonVariants } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import ShowSocietyDetail from "~/components/society/ShowSocietyDetail";
import { toast } from "~/components/ui/use-toast";

export default function BackBar() {
  const params = useParams<{ societyId: string }>();
  const { data: name, isLoading } = api.society.getName.useQuery(
    { id: params.societyId },
    {
      onError(err) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      },
    },
  );
  return (
    <div className="flex flex-row border-y px-2 py-4">
      <Link
        className={buttonVariants({
          variant: "ghost",
          className: "mr-auto",
        })}
        href="/dashboard"
      >
        <ChevronLeft />
        <span>
          {isLoading || !name ? (
            <Skeleton className="mx-2 h-5 w-1/4" />
          ) : name.length > 25 ? (
            `${name?.slice(0, 24)}...`
          ) : (
            name
          )}
        </span>
      </Link>
      <TooltipProvider>
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="rounded-full" size="icon">
                  <InfoIcon />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get Info</p>
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent className="max-h-screen overflow-y-scroll">
            <ShowSocietyDetail />
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </div>
  );
}
