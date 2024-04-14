import { type Metadata } from "next";
import ClientOnly from "~/components/ClientOnly";
import { Support } from "~/components/public/Support";

export const metadata: Metadata = {
  title: "Support | SocietyEaseHub",
  description:
    "Find comprehensive support resources for SocietyEaseHub, your all-in-one society management system. Get answers to your questions, access tutorials, and contact our dedicated support team for assistance",
  keywords: [
    "SocietyEaseHub support",
    "Society management system assistance",
    "Help center",
    "Customer support",
    "Technical support",
    "Troubleshooting",
    "FAQs",
    "Tutorials",
    "Contact support",
  ],
};

export default function Page() {
  return (
    <ClientOnly>
      <Support />
    </ClientOnly>
  );
}
