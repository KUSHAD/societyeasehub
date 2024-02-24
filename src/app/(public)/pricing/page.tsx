import { type Metadata } from "next";
import Pricing from "~/components/pricing/Pricing";

export const metadata: Metadata = {
  title: "Pricing | SocietyEaseHub",
  description:
    "Explore transparent and flexible pricing plans for SocietyEase Hub, your all-in-one SaaS solution for society management. Choose the perfect plan to fit your community's needs and budget.",
  keywords: [
    "SaaS pricing",
    "Society management plans",
    "Flexible pricing",
    "Community software costs",
    "Transparent pricing",
    "Affordable community solutions",
    "Pricing tiers",
    "Budget-friendly society management",
  ],
};

export default function Page() {
  return <Pricing />;
}
