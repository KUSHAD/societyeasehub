import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: PageProps) {
  const society = await api.society.getInfo.query({
    id,
  });

  if (!society) redirect("/dashboard");
  return <div>Page</div>;
}
