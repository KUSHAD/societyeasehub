/* eslint-disable @typescript-eslint/ban-ts-comment */
import { api } from "~/trpc/react";
import {
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { useParams } from "next/navigation";
import { toast } from "../ui/use-toast";
import Skeleton from "react-loading-skeleton";
import { beautifyObjectName } from "../ui/auto-form/utils";
import CarouselPlayer, { CarouselPlayerSkeleton } from "./CarouselPlayer";

export default function ShowSocietyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: medias, isLoading: mediaLoading } =
    api.societyMedia.getBySociety.useQuery(
      {
        societyId: id,
      },
      {
        onError(error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
        retry(failureCount) {
          if (failureCount >= 3) return true;

          return false;
        },
        retryDelay: 500,
      },
    );

  const { data: societyDetails, isLoading } = api.society.getInfo.useQuery(
    {
      id,
    },
    {
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },
      retryDelay: 500,
      onSuccess(data) {
        if (!data)
          return toast({
            title: "Error",
            description: "No Society Found",
            variant: "destructive",
          });
      },
    },
  );
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>About Society</AlertDialogTitle>
      </AlertDialogHeader>
      <div className="flex flex-col border">
        <div className="px-4 py-2">
          {isLoading ? (
            <Skeleton className="h-[16px] w-full" count={7} />
          ) : (
            <>
              {societyDetails &&
                Object.keys(societyDetails).map((_key) => (
                  <div className="my-1 flex-row">
                    <strong>{beautifyObjectName(_key)} : </strong>
                    {
                      // @ts-ignore
                      <em>{societyDetails[_key] ?? "N/A"}</em>
                    }
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
      {mediaLoading ? (
        <CarouselPlayerSkeleton />
      ) : (
        medias && medias.length !== 0 && <CarouselPlayer medias={medias} />
      )}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading || mediaLoading}>
          Close
        </AlertDialogCancel>
      </AlertDialogFooter>
    </>
  );
}
