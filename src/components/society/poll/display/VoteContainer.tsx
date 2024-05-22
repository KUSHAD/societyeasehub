"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

interface VoteContainerProps {
  vote: {
    name: string;
    count: number;
    percentage: number;
  };
}

export default function VoteContainer({ vote }: VoteContainerProps) {
  return (
    <Card className="my-1">
      <CardHeader>
        <CardTitle>{vote.name}</CardTitle>
        <CardDescription>{vote.count} Votes</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress className="w-full" value={vote.percentage} />
      </CardContent>
    </Card>
  );
}
