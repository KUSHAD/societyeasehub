import { canCreatePolls } from "~/actions/checkUserRole";
import ClientOnly from "~/components/ClientOnly";
import CreatePollContainer from "~/components/society/poll/create/CreatePollContainer";
import PollsViewContainer from "~/components/society/poll/display/PollsViewContainer";
import { type PageProps } from "~/lib/types";

export default async function Page({ params: { societyId } }: PageProps) {
  const canCreate = await canCreatePolls(societyId);
  return (
    <>
      {canCreate ? (
        <div className="flex flex-row">
          <div className="mr-auto" />
          <ClientOnly>
            <CreatePollContainer />
          </ClientOnly>
        </div>
      ) : null}
      <ClientOnly>
        <PollsViewContainer />
      </ClientOnly>
    </>
  );
}
