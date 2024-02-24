import { homeFeatures } from "~/lib/utils";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section className="mx-auto mt-20 max-w-6xl" id="features">
      <h3 className="mb-10 text-center text-3xl font-bold text-gray-800">
        Features
      </h3>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {homeFeatures.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
