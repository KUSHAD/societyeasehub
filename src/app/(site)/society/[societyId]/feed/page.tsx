import { redirect } from "next/navigation";
import { type PageProps } from "~/lib/types";

export default function Page({ params: { id } }: PageProps) {
  return redirect(`/society/${id}/feed/announcement`);
}
