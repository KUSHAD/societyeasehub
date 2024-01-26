/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { editSocietyValidationSchema } from "~/lib/validators/editSociety";
import AutoForm, { AutoFormSubmit } from "../../../ui/auto-form";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "../../../ui/use-toast";
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
  const { mutate: update, isLoading: updating } =
    api.society.update.useMutation({
      onSuccess: async () => {
        toast({
          title: "Message",
          description: "Details Updated Successfully",
        });
        setOpen(false);
        await utils.society.getInfo.invalidate();
      },
    });
  const { data: societyDetails, isLoading } = api.society.getInfo.useQuery({
    id,
  });

  return (
    <>
      {isLoading ? (
        <Card>
          <CardHeader className="flex flex-row">
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="my-1 h-5 w-full" count={7} />
          </CardContent>
        </Card>
      ) : (
        <Card className="my-2 flex flex-col">
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
      <AlertDialog open={open} onOpenChange={(_state) => setOpen(_state)}>
        <AlertDialogContent className="max-h-screen overflow-y-scroll lg:max-w-screen-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Details</AlertDialogTitle>
          </AlertDialogHeader>
          {isLoading ? (
            <Skeleton className="my-4 h-5 w-full" count={7} />
          ) : (
            societyDetails && (
              <AutoForm
                onSubmit={(data) =>
                  update({
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
