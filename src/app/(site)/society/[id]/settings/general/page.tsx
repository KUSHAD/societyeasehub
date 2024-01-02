import ClientOnly from "~/components/ClientOnly";
import UpdateDetails from "~/components/society/settings/general/UpdateDetails";

export default function Page() {
  return (
    <>
      <ClientOnly>
        <UpdateDetails />
      </ClientOnly>
    </>
  );
}
