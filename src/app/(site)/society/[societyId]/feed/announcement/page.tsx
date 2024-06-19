import { canAnnounce } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import AnnouncementContainer from "~/components/society/announcement/AnnouncementContainer";
import AnnouncementInput from "~/components/society/announcement/AnnouncementInput";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { societyId } }: PageProps) {
  const canAccess = await canAnnounce(societyId);
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
