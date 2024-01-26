import { redirect } from "next/navigation";
import { checkSocietyExists } from "~/actions/checkSocietyExists";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const societyExists = await checkSocietyExists(id);

  if (!societyExists) redirect("/dashboard");

  return redirect(`/society/${id}/feed`);
}
