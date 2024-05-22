"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import CreatePollInput from "./CreatePollInput";

export default function CreatePollContainer() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Create Poll</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Poll</AlertDialogTitle>
        </AlertDialogHeader>
        <CreatePollInput />
      </AlertDialogContent>
    </AlertDialog>
  );
}
