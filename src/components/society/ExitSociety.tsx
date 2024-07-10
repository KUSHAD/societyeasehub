"use client";

import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useParams, useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

export default function ExitSociety() {
  const { societyId } = useParams<{ societyId: string }>();
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate: exitSociety, isPending } = api.member.exitSociety.useMutation(
    {
      onSuccess: async () => {
        await utils.society.getUserMemberships.invalidate();
        router.push("/dashboard");
      },
    },
  );
  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle>Exit Society</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Leaving this society will only remove you from the society and
          it&apos;s access is removed but users can still invite you again
        </CardDescription>
      </CardContent>
      <CardFooter>
        <div className="mr-auto" />
        <Button
          disabled={isPending}
          variant="destructive"
          onClick={() => exitSociety({ societyId })}
        >
          {isPending ? <RefreshCcw className="animate-spin" /> : "Exit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
