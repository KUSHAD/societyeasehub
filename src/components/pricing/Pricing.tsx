import { Card } from "~/components/ui/card";
import { pricingFeatures } from "~/lib/utils";
import StandardPlan from "./StandardPlan";

export default function Pricing() {
  return (
    <Card className="flex min-h-screen flex-col items-center justify-center">
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
            One Plan for All Your Needs
          </p>
          <p className="mt-2 text-xl text-gray-500 dark:text-gray-400">
            Get unlimited access to all features at one price
          </p>
        </div>
        <div className="mt-10">
          <ul className="space-y-4 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:border-t sm:border-gray-200 lg:space-y-4">
            <li className="flex flex-col divide-y divide-gray-200 rounded-lg border shadow-sm md:flex-row md:divide-x md:divide-y-0">
              <StandardPlan features={pricingFeatures} />
            </li>
          </ul>
        </div>
      </main>
    </Card>
  );
}
