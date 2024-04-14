import { type Metadata } from "next";
import RefundPolicy from "~/components/public/RefundPolicy";

export const metadata: Metadata = {
  title: "Refund Policy | SocietyEaseHub",
  description:
    "Learn about our refund policy for SocietyEaseHub, your trusted society management system. Understand eligibility criteria, refund process, and contact information for refund requests.",
  keywords: [
    "SocietyEaseHub refund policy",
    "Subscription refunds",
    "Cancelation policy",
    "Refund eligibility",
    "Refund request",
    "Refund process",
    "Contact for refunds",
    "Refund terms",
  ],
};

export default function Page() {
  return <RefundPolicy />;
}
