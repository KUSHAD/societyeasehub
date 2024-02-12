import { type Metadata } from "next";
import CookiePolicy from "~/components/public/CookiePolicy";

export const metadata: Metadata = {
  title: "Cookie Policy | SocietyEaseHub",
  description:
    "Our Cookie Policy explains how we use cookies and similar technologies to enhance user experience and analyze website traffic. Learn about your options for managing cookies",
  keywords: [
    "Cookie policy",
    "Cookies",
    "Tracking technologies",
    "User experience",
    "Website traffic analysis",
    "Cookie management",
  ],
};

export default function Page() {
  return <CookiePolicy />;
}
