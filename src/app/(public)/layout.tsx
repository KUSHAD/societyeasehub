import React from "react";
import PublicNavbar from "~/components/navbar/public";
import Footer from "~/components/navbar/public/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNavbar />
      <main className="mt-4 px-2">{children}</main>
      <Footer />
    </>
  );
}
