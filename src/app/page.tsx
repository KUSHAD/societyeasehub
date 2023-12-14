import UserMemberships from "~/components/home/UserMemberships";
import { api } from "~/trpc/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  const userMemberShips = await api.society.getUserMemberships.query();

  return <UserMemberships userMemberShips={userMemberShips} />;
}
