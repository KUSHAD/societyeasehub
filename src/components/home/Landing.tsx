import SocietyDescription from "./SocietyDescription";
import FeaturesSection from "./FeatureSection";
import SocietyIllustration from "./SocietyIllustration";

export default function Landing(): JSX.Element {
  return (
    <div className="min-h-screen px-3 py-10 sm:px-5">
      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <SocietyDescription />
          <SocietyIllustration />
        </div>
      </section>
      <FeaturesSection />
    </div>
  );
}
