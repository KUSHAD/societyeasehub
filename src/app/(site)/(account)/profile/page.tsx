import { Suspense } from "react";
import ShowProfile, {
  ShowProfileSkeleton,
} from "~/components/profile/ShowProfile";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ShowProfileSkeleton />}>
          <ShowProfile />
        </Suspense>
      </CardContent>
    </Card>
  );
}
