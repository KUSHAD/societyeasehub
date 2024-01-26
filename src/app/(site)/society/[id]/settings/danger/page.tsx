import { redirect } from "next/navigation";
import { canAccessDanger } from "~/actions/checkUserRole";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canAccess = await canAccessDanger(id);

  if (!canAccess) redirect(`/society/${id}/feed`);
  return <div>Danger Page</div>;
}
