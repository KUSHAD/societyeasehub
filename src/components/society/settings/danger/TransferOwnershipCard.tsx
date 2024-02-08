import ClientOnly from "~/components/ClientOnly";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import TransferOwnershipForm from "./TransferOwnershipForm";

export default function TransferOwnershipCard() {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>Transfer Ownership</CardTitle>
        <CardDescription>
          Transfer Ownership of this society to one of your members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientOnly>
          <TransferOwnershipForm />
        </ClientOnly>
      </CardContent>
    </Card>
  );
}
