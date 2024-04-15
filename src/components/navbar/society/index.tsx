import ClientOnly from "~/components/ClientOnly";
import Contents from "./Contents";

export default function SocietyTabs() {
  return (
    <div className="flex w-full justify-center overflow-auto border-b">
      <ClientOnly>
        <Contents />
      </ClientOnly>
    </div>
  );
}
