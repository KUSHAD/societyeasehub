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
import CreateInviteContent from "./CreateInviteContent";

export default function CreateInvite() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Create An Invite</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send an Invite</AlertDialogTitle>
        </AlertDialogHeader>
        <CreateInviteContent />
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
