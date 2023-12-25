import ClientOnly from "~/components/ClientOnly";
import SocietyMedias from "~/components/society/settings/SocietyMedias";
import UpdateDetails from "~/components/society/settings/UpdateDetails";

export default function Page() {
  return (
    <>
      <ClientOnly>
        <UpdateDetails />
        <SocietyMedias />
      </ClientOnly>
    </>
  );
}
