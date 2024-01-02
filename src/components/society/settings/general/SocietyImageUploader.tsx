"use client";

import { UploadDropzone } from "~/lib/uploadthing";
import { cn, uploaderClassName } from "~/lib/utils";
import { toast } from "../../../ui/use-toast";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export default function SocietyImageUploader() {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const [isUploading, setIsUploading] = useState(false);
  const [open, setIsOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={(_open) => setIsOpen(_open)}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setIsOpen((prevState) => !prevState)}>
          Upload
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload New Media</AlertDialogTitle>
        </AlertDialogHeader>
        <UploadDropzone
          input={{
            societyId: id,
          }}
          onBeforeUploadBegin={(files) => {
            setIsUploading(true);
            return files;
          }}
          className={cn(uploaderClassName)}
          onUploadError={(error) => {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
            setIsUploading(false);
          }}
          onClientUploadComplete={async () => {
            await utils.societyMedia.getSocietyMedia.invalidate();
            setIsUploading(false);
            setIsOpen(false);
          }}
          endpoint="societyMedia"
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUploading}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
