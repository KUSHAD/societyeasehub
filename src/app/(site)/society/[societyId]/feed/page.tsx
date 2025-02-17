import { redirect } from "next/navigation";
import { type PageProps } from "~/lib/types";

export default async function Page(props: PageProps) {
  const params = await props.params;

  const {
    societyId
  } = params;

  return redirect(`/society/${societyId}/feed/announcement`);
}
