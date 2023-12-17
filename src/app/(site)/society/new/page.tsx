import ClientOnly from "~/components/ClientOnly";
import NewSocietyForm from "~/components/society/NewSocietyForm";

export default function Page() {
  return (
    <>
      <h1 className="mb-3 text-xl font-bold text-gray-900">Create Society</h1>
      <ClientOnly>
        <NewSocietyForm />
      </ClientOnly>
    </>
  );
}
