"use client";

import { type ListWithCards } from "~/lib/types";
import ListForm from "./ListForm";
import ListItem from "./ListItem";

interface ListContainerProps {
  data: ListWithCards[];
}

export default function ListContainer({ data }: ListContainerProps) {
  return (
    <ol className="flex h-full gap-3">
      {data.map((_list, index) => (
        <ListItem key={_list.id} index={index} data={_list} />
      ))}
      <ListForm />
      <div className="w-1 flex-shrink-0" />
    </ol>
  );
}
