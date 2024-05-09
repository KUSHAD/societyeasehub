import { canAnnounce } from "~/actions/checkUserRole";
import AnnouncementInput from "~/components/society/announcement/AnnouncementInput";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canAccess = await canAnnounce(id);
  return <>{canAccess ? <AnnouncementInput /> : null}</>;
}
