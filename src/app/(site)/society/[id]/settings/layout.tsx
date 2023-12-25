import React from "react";
import SettingsDrawer from "~/components/navbar/society/SettingsDrawer";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <SettingsDrawer />
      <div className="flex w-full flex-col"> {children}</div>
    </div>
  );
}
