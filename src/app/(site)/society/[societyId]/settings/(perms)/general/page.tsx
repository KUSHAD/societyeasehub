import { redirect } from "next/navigation";
import { canAccessSettings, isSocietyOwner } from "~/actions/checkUserRole";
import { getCurrentUser } from "~/actions/getCurrentUser";
import ClientOnly from "~/components/ClientOnly";
import ExitSociety from "~/components/society/ExitSociety";
import SocietyMedias from "~/components/society/settings/general/SocietyMedias";
import UpdateDetails from "~/components/society/settings/general/UpdateDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { societyId } }: PageProps) {
  const canAccess = await canAccessSettings(societyId);
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/api/auth/signin");
  const isOwner = await isSocietyOwner(societyId, currentUser.id);

  if (!canAccess) redirect(`/society/${societyId}/settings`);
  return (
    <div className="px-4 py-2">
      <ClientOnly>
        {isOwner ? (
          <>
            <UpdateDetails />
            <SocietyMedias />
          </>
        ) : (
          <>
            <Accordion defaultValue="society" type="single" collapsible>
              <AccordionItem value="society">
                <AccordionTrigger>Society</AccordionTrigger>
                <AccordionContent>
                  <UpdateDetails />
                  <SocietyMedias />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="exit">
                <AccordionTrigger>Exit Society</AccordionTrigger>
                <AccordionContent>
                  <ExitSociety />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </ClientOnly>
    </div>
  );
}
