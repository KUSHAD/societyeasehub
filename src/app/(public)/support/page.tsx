import ClientOnly from "~/components/ClientOnly";
import { Support } from "~/components/public/Support";

export default function Page() {
  return (
    <ClientOnly>
      <Support />
    </ClientOnly>
  );
}
