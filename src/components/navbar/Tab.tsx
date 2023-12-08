import ClientOnly from "../ClientOnly";
import TabContents from "./TabContents";

export default function Tab() {
  return (
    <div className="sticky bottom-0 left-0 z-10 block border-t bg-background sm:hidden">
      <div className="flex flex-row justify-between">
        <ClientOnly>
          <TabContents />
        </ClientOnly>
      </div>
    </div>
  );
}
