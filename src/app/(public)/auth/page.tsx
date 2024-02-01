import { type Metadata } from "next";
import ClientOnly from "~/components/ClientOnly";
import AuthButtons from "~/components/auth/AuthButtons";
import AuthError from "~/components/auth/AuthError";

export const metadata: Metadata = {
  title: "Authentication | SocietyEaseHub",
  description:
    "Secure and seamless authentication for your society management needs. Explore our advanced authentication features, ensuring the protection of your community's sensitive data. Trust SocietyEase Hub for reliable access control.",
  keywords: [
    "Authentication system",
    "Secure login",
    "Access control",
    "Community authentication",
    "User verification",
    "Society security",
    "Trusted authentication solution",
  ],
};

export default function Page() {
  return (
    <>
      <ClientOnly>
        <AuthError />
        <AuthButtons />
      </ClientOnly>
    </>
  );
}
