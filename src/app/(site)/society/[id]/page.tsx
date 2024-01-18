import { redirect } from "next/navigation";
import { checkSocietyExists } from "~/actions/checkSocietyExists";
import type { PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const society = await checkSocietyExists(id);

  if (!society) redirect("/dashboard");
  return <div>Page</div>;
}
