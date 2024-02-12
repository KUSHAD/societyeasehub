import { type Metadata } from "next";
import PrivacyPolicy from "~/components/public/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | SocietyEaseHub",
  description:
    "Our Privacy Policy outlines how we handle user data with transparency and care. Learn about our data collection, usage, and disclosure practices to ensure your privacy and security",
  keywords: [
    "Privacy policy",
    "Data collection",
    "Data usage",
    "Data disclosure",
    "User privacy",
    "Privacy practices",
    "Data security",
  ],
};

export default function Page() {
  return <PrivacyPolicy />;
}
