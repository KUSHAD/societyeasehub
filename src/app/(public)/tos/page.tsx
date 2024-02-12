import ToS from "~/components/public/ToS";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SocietyEaseHub",
  description:
    "Our Terms of Service outline the terms and conditions governing the use of our society management system SaaS product. Review our policies to understand your rights and responsibilities.",
  keywords: [
    "Terms of service",
    "Terms and conditions",
    "SaaS product",
    "Society management system",
    "User rights",
    "User responsibilities",
  ],
};

export default function Page() {
  return <ToS />;
}
