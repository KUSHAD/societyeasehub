import ClientOnly from "~/components/ClientOnly";
import KanbanBoard from "~/components/roadmap/KanbanBoard";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ClientOnly>
      <KanbanBoard />
    </ClientOnly>
  );
}
