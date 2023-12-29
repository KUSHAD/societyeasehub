import { redirect } from "next/navigation";
import { checkSocietyExists } from "~/actions/checkSocietyExists";

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function Page({ params: { id } }: PageProps) {
  const society = await checkSocietyExists(id);

  if (!society) redirect("/dashboard");
  return <div>Page</div>;
}
