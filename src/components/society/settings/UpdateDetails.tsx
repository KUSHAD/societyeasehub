/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { editSocietyValidationSchema } from "~/lib/validators/editSociety";
import AutoForm, { AutoFormSubmit } from "../../ui/auto-form";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "../../ui/use-toast";
import { beautifyObjectName } from "~/components/ui/auto-form/utils";
import Skeleton from "react-loading-skeleton";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function UpdateDetails() {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const { mutate: updateDetails, isLoading: updating } =
    api.society.updateDetails.useMutation({
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      onSuccess: async () => {
        toast({
          title: "Message",
          description: "Details Updated Successfully",
        });
        setOpen(false);
        await utils.society.getInfo.invalidate();
      },
      retry(failureCount) {
        if (failureCount >= 3) return true;

        return false;
      },
      retryDelay: 500,
    });
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
    },
  );

  return (
    <>
      <div className="px-4 py-2">
        {isLoading ? (
          <Skeleton className="h-[16px] w-full" count={7} />
        ) : (
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row">
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              {societyDetails &&
                Object.keys(societyDetails).map((_key) => (
                  <div className="my-1 flex-row" key={_key}>
                    <strong>{beautifyObjectName(_key)} : </strong>
                    {
                      // @ts-ignore
                      <em>{societyDetails[_key] ?? "N/A"}</em>
                    }
                  </div>
                ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setOpen(true)}>Update Details</Button>
            </CardFooter>
          </Card>
        )}
      </div>
      <AlertDialog open={open} onOpenChange={(_state) => setOpen(_state)}>
        <AlertDialogContent className="max-h-screen overflow-y-scroll lg:max-w-screen-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Details</AlertDialogTitle>
          </AlertDialogHeader>
          {isLoading ? (
            <Skeleton className="h-[16px] w-full" count={7} />
          ) : (
            societyDetails && (
              <AutoForm
                onSubmit={(data) =>
                  updateDetails({
                    ...data,
                    id,
                  })
                }
                values={{
                  ...societyDetails,
                  addressLine2: societyDetails.addressLine2 ?? "",
                  country: societyDetails.country,
                }}
                formSchema={editSocietyValidationSchema}
                fieldConfig={{
                  zipCode: {
                    fieldType: "number",
                  },
                }}
              >
                <AutoFormSubmit disabled={updating} className="w-full" />
              </AutoForm>
            )
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updating}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
