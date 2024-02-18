import ClientOnly from "~/components/ClientOnly";
import MessageContainer from "~/components/society/channel/message/MessageContainer";

export default function Page() {
  return (
    <ClientOnly>
      <MessageContainer />
    </ClientOnly>
  );
}
