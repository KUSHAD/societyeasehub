import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function PricingDetails() {
  return (
    <div className="flex flex-1 flex-col border-t border-gray-200 p-8 dark:border-gray-700 md:border-0 md:border-l">
      <div className="flex-1">
        <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 sm:text-4xl">
          <span className="mr-1">₹</span>
          125
        </p>
        <p className="text-base font-semibold text-gray-500 dark:text-gray-400">
          per month
        </p>
      </div>
      <div className="mt-6">
        <Link
          className={buttonVariants({
            className:
              "flex w-full items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium",
          })}
          href="/auth"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
