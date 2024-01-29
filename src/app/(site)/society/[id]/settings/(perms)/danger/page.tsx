import { redirect } from "next/navigation";
import { canAccessSettings } from "~/actions/checkUserRole";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canAccess = await canAccessSettings(id);

  if (!canAccess) redirect(`/society/${id}/feed`);
  return <div>Danger Page</div>;
}
