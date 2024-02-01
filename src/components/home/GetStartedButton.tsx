import { getCurrentUser } from "~/actions/getCurrentUser";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

export default async function GetStartedButton() {
  const currentUser = await getCurrentUser();
  return currentUser ? (
    <Link href="/dashboard" className={buttonVariants()}>
      Dashboard
    </Link>
  ) : (
    <Link href="/auth" className={buttonVariants()}>
      Get Started
    </Link>
  );
}
