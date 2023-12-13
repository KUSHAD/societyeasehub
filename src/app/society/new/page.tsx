import ClientOnly from "~/components/ClientOnly";
import NewSocietyForm from "~/components/society/NewSocietyForm";

export default function Page() {
  return (
    <ClientOnly>
      <NewSocietyForm />
    </ClientOnly>
  );
}
