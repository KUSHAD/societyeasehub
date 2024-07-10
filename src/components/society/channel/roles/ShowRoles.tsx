"use client";

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import NotAllowedRoles from "./NotAllowedRoles";
import AllowedRoles from "./AllowedRoles";

export default function ShowRoles() {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Manage Channel Access</AlertDialogTitle>
        <AlertDialogDescription>
          Roles which have manage channel and send message perms can will see
          this chat and can manage and send messages to this channel
        </AlertDialogDescription>
      </AlertDialogHeader>
      <strong>Roles which have access</strong>
      <AllowedRoles />
      <hr />
      <strong>Roles which don't have access</strong>
      <NotAllowedRoles />
      <AlertDialogFooter>
        <AlertDialogCancel>Close</AlertDialogCancel>{" "}
      </AlertDialogFooter>
    </>
  );
}
