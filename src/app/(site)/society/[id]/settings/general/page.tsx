import ClientOnly from "~/components/ClientOnly";
import UpdateDetails from "~/components/society/UpdateDetails";

export default function Page() {
  return (
    <ClientOnly>
      <UpdateDetails />
    </ClientOnly>
  );
}
