import { canCreateMeetings } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import CreateMeetingForm from "~/components/society/meeting/CreateMeetingForm";
import ShowMeetingContainer from "~/components/society/meeting/ShowMeetingContainer";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { id } }: PageProps) {
  const createMeetings = await canCreateMeetings(id);
  return (
    <>
      {createMeetings ? (
        <>
          <div className="flex flex-row">
            <div className="mr-auto" />
            <ClientOnly>
              <CreateMeetingForm />
            </ClientOnly>
          </div>
          <hr className="my-1" />
        </>
      ) : null}
      <ClientOnly>
        <ShowMeetingContainer />
      </ClientOnly>
    </>
  );
}
