import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import GetStartedButton from "./GetStartedButton";

export default function SocietyDescription() {
  return (
    <div className="lg:w-1/2">
      <h2 className="mb-6 text-4xl font-bold text-gray-800">
        Manage Your Society with Ease
      </h2>
      <p className="mb-6 text-gray-600">
        Introducing SocietyEaseHub, the ultimate SaaS platform for efficient and
        seamless management of your residential or corporate societies.
      </p>
      <Suspense fallback={<Skeleton className="h-[50px] w-[200px]" />}>
        <GetStartedButton />
      </Suspense>
    </div>
  );
}
