import ClientOnly from "~/components/ClientOnly";
import SocietyMedias from "~/components/society/settings/general/SocietyMedias";
import UpdateDetails from "~/components/society/settings/general/UpdateDetails";

export default function Page() {
  return (
    <div className="px-4 py-2">
      <ClientOnly>
        <UpdateDetails />
        <SocietyMedias />
      </ClientOnly>
    </div>
  );
}
