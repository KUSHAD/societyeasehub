import { Suspense } from "react";
import ShowProfile, {
  ShowProfileSkeleton,
} from "~/components/profile/ShowProfile";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const revalidate = 0;
export const dynamic = "force-dynamic";

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
