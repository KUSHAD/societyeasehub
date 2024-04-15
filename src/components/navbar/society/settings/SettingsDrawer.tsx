import ClientOnly from "~/components/ClientOnly";
import SettingsDrawerContents from "./SettingsDrawerContents";

export default function SettingsDrawer() {
  return (
    <div className="flex flex-col">
      <ClientOnly>
        <SettingsDrawerContents />
      </ClientOnly>
    </div>
  );
}
