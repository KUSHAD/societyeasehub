import { Suspense } from "react";
import UserMemberships, {
  UserMembershipsSkeleton,
} from "~/components/home/UserMemberships";

export default function Home() {
  return (
    <Suspense fallback={<UserMembershipsSkeleton />}>
      <UserMemberships />
    </Suspense>
  );
}
