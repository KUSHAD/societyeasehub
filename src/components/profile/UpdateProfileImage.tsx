"use client";

import { UploadDropzone } from "~/lib/uploadthing";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn, uploaderClassName } from "~/lib/utils";

export default function UpdateProfileImage() {
  const [open, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  return (
    <AlertDialog open={open} onOpenChange={(_open) => setIsOpen(_open)}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => setIsOpen((prevState) => !prevState)}
          variant="ghost"
          size="icon"
          className="my-8"
        >
          <Pencil2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Profile Image</AlertDialogTitle>
        </AlertDialogHeader>
        <UploadDropzone
          className={cn(uploaderClassName)}
          config={{
            appendOnPaste: true,
            mode: "auto",
          }}
          endpoint="profileImage"
          onBeforeUploadBegin={(files) => {
            setIsUploading(true);
            return files;
          }}
          onClientUploadComplete={() => {
            toast({
              title: "Success",
              description: "Profile Picture Updated",
            });
            setIsUploading(false);
            setIsOpen(false);
            router.refresh();
          }}
          onUploadError={() => {
            setIsUploading(false);
          }}
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUploading}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
