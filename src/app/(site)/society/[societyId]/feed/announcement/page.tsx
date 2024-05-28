import { canAnnounce } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import AnnouncementContainer from "~/components/society/announcement/AnnouncementContainer";
import AnnouncementInput from "~/components/society/announcement/AnnouncementInput";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const canAccess = await canAnnounce(id);
  return (
    <>
      {canAccess ? (
        <ClientOnly>
          <AnnouncementInput />
        </ClientOnly>
      ) : null}

      <ClientOnly>
        <AnnouncementContainer />
      </ClientOnly>
    </>
  );
}
