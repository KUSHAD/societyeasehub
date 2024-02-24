import Feature from "./Feature";
import PricingDetails from "./PricingDetails";

interface StandardPlanProps {
  features: string[];
}

export default function StandardPlan({ features }: StandardPlanProps) {
  return (
    <>
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Standard Plan
        </h3>
        <p className="mt-4 flex-1 text-gray-500 dark:text-gray-400">
          Unlimited access to all features for a single price.
        </p>
        <div className="mt-6">
          <ul className="space-y-4">
            {features.map((feature) => (
              <Feature key={feature} text={feature} />
            ))}
          </ul>
        </div>
      </div>
      <PricingDetails />
    </>
  );
}
