import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-[400px]">
        <Card>
          <CardHeader>
            <CardTitle>Page not found</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              The page you have requested is not found
            </CardDescription>
            <Link
              href="/"
              className={buttonVariants({
                className: "mt-2 w-full",
              })}
            >
              Go back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
