import ClientOnly from "~/components/ClientOnly";
import UpdateDetails from "~/components/society/settings/UpdateDetails";

export default function Page() {
  return (
    <>
      <ClientOnly>
        <UpdateDetails />
      </ClientOnly>
    </>
  );
}
