import ClientOnly from "~/components/ClientOnly";
import MeetingPlayer from "~/components/society/meeting/players/MeetingPlayer";

export default function Page() {
  return (
    <ClientOnly>
      <MeetingPlayer />
    </ClientOnly>
  );
}
