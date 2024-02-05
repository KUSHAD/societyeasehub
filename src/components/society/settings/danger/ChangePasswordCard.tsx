import ClientOnly from "~/components/ClientOnly";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ChangePasswordForm from "./ChangePasswordForm";

export default function ChangePasswordCard() {
  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Change Society Password Required For Sensitive Actions. Your previous
          passwords will not work after the update
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientOnly>
          <ChangePasswordForm />
        </ClientOnly>
      </CardContent>
    </Card>
  );
}
