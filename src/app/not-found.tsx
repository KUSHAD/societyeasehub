import Link from "next/link";
import NotFound from "~/components/NotFound";
import Navbar from "~/components/navbar/site";
import { buttonVariants } from "~/components/ui/button";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <NotFound
        message="Page not found"
        description="The link you have visited might be broken or has been moved"
      >
        <Link href="/" className={buttonVariants()}>
          Back to Home Page
        </Link>
      </NotFound>
    </>
  );
}
