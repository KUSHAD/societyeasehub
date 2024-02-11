import ClientOnly from "~/components/ClientOnly";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import DeleteSocietyForm from "./DeleteSocietyForm";

export default function DeleteSocietyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle> Delete Society</CardTitle>
        <CardDescription>
          This deletes all the resources related to this society also.This
          action cannot be undone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientOnly>
          <DeleteSocietyForm />
        </ClientOnly>
      </CardContent>
    </Card>
  );
}
