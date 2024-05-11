"use client";

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
import MediaRenderer from "../../channel/chat/MediaRenderer";

export default function AttachmentViewContainer(props: {
  uri: string;
  name: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mx-2 px-2 py-8" variant="outline">
          {props.name}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>View Attachment</AlertDialogTitle>
        </AlertDialogHeader>
        <MediaRenderer uri={props.uri} />
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
