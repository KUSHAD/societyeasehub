import { redirect } from "next/navigation";
import { type PageProps } from "~/lib/types";

export default function Page({ params: { societyId } }: PageProps) {
  return redirect(`/society/${societyId}/feed/announcement`);
}
