import { redirect } from "next/navigation";
import { checkIsSocietyMember } from "~/actions/checkIsSocietyMember";
import { type PageProps } from "~/lib/types";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Page({ params: { id } }: PageProps) {
  const societyExists = await checkIsSocietyMember(id);

  if (!societyExists) redirect("/dashboard");

  return redirect(`/society/${id}/feed`);
}
