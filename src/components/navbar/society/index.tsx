import ClientOnly from "~/components/ClientOnly";
import Contents from "./Contents";

export default function SocietyTabs() {
  return (
    <div className="flex w-full flex-row justify-center">
      <ClientOnly>
        <Contents />
      </ClientOnly>
    </div>
  );
}
