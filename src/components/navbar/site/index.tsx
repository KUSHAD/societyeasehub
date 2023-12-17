import { Suspense } from "react";
import ClientOnly from "../../ClientOnly";
import { Skeleton } from "../../ui/skeleton";
import NavContent from "./Contents";
import Logo from "./Logo";
import ProfileContent from "./ProfileContent";

export default function Navbar() {
  return (
    <nav className="sticky left-0 top-0 z-10  bg-background shadow-md">
      <div className="flex flex-row px-2 py-3">
        <Logo />
        <ClientOnly>
          <NavContent />
        </ClientOnly>
        <Suspense
          fallback={
            <Skeleton className="my-2 h-[48px] w-[48px] rounded-full" />
          }
        >
          <ProfileContent />
        </Suspense>
      </div>
    </nav>
  );
}
