import React from "react";
import PublicNavbar from "~/components/navbar/public";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="mt-4 px-2">{children}</main>
    </>
  );
}
