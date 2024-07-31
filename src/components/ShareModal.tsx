"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import IntegrateJson from "./integration/IntegrateJson";
import IntegrateEmbed from "./integration/IntegrateEmbed";
import IntegrateNextjs from "./integration/IntegrateNextjs";
import { useShareModalStore } from "~/store/shareModal";
import APIKeyChooser from "./society/settings/integration/APIKeyChooser";

export default function ShareModal() {
  const { isOpen, onClose } = useShareModalStore();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Integrate</AlertDialogTitle>
          <AlertDialogDescription>
            Choose your favorite integration method
          </AlertDialogDescription>
        </AlertDialogHeader>
        <APIKeyChooser isModal />
        <Tabs defaultValue="embed" className="w-fit">
          <TabsList className="w-full">
            <TabsTrigger value="embed">Embed</TabsTrigger>
            <TabsTrigger value="json">JSON - Data</TabsTrigger>
            <TabsTrigger value="nextjs">Next JS</TabsTrigger>
          </TabsList>
          <TabsContent value="embed">
            <IntegrateEmbed />
          </TabsContent>
          <TabsContent value="json">
            <IntegrateJson />
          </TabsContent>
          <TabsContent value="nextjs">
            <IntegrateNextjs />
          </TabsContent>
        </Tabs>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
