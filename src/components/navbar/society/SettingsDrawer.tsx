import ClientOnly from "~/components/ClientOnly";
import SettingsDrawerContents from "./SettingsDrawerContents";

export default function SettingsDrawer() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden border-r">
      <ClientOnly>
        <SettingsDrawerContents />
      </ClientOnly>
    </div>
  );
}
