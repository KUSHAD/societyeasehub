import { redirect } from "next/navigation";
import { type PageProps } from "~/lib/types";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page({ params: { id } }: PageProps) {
  return redirect(`/society/${id}/feed/announcement`);
}
