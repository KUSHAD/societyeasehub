"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { toast } from "~/components/ui/use-toast";
import { UploadDropzone } from "~/lib/uploadthing";
import { uploaderClassName } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function AddDocs({ transactionId }: { transactionId: string }) {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const utils = api.useUtils();
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Add Transaction Documents</AlertDialogTitle>
      </AlertDialogHeader>
      <UploadDropzone
        endpoint="transactionDocs"
        input={{
          societyId: id,
          transactionId,
        }}
        onBeforeUploadBegin={(files) => {
          setIsLoading(false);

          return files;
        }}
        onClientUploadComplete={async () => {
          setIsLoading(false);
          await utils.transactionDocs.getByTransaction.invalidate({
            societyId: id,
            transactionId,
          });
          toast({
            title: "Message",
            description: "Documents Uploaded",
          });
        }}
        onUploadError={({ message }) => {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
          setIsLoading(false);
        }}
        className={uploaderClassName}
      />
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
      </AlertDialogFooter>
    </>
  );
}
