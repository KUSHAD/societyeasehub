import ClientOnly from "~/components/ClientOnly";
import KanbanBoard from "~/components/society/roadmap/KanbanBoard";

export const revalidate = 0;

export default function Page() {
  return (
    <div className="h-full overflow-x-auto p-4">
      <ClientOnly>
        <KanbanBoard />
      </ClientOnly>
    </div>
  );
}
