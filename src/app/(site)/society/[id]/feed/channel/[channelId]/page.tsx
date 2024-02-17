import ClientOnly from "~/components/ClientOnly";
import MessageContainer from "~/components/society/channel/MessageContainer";

export default function Page() {
  return (
    <ClientOnly>
      <MessageContainer />
    </ClientOnly>
  );
}
