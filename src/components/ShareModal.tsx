"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import IntegrateJson from "./integration/IntegrateJson";
import { useShareModalStore } from "~/store/shareModal";
import APIKeyChooser from "./society/settings/integration/APIKeyChooser";

export default function ShareModal() {
  const { isOpen, onClose } = useShareModalStore();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Integrate</AlertDialogTitle>
        </AlertDialogHeader>
        <APIKeyChooser isModal />
        <IntegrateJson />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
