"use client";

// import { useParams } from "next/navigation";
import { type ListWithCards } from "~/lib/types";
import ListForm from "./ListForm";

interface ListContainerProps {
  data: ListWithCards[];
}

export default function ListContainer({}: ListContainerProps) {
  // const { id } = useParams<{ id: string }>();
  return (
    <ol>
      <ListForm />
      <div className="w-1 flex-shrink-0" />
    </ol>
  );
}
