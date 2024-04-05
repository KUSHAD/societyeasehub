"use client";

import { type ListWithCards } from "~/lib/types";
import ListHeader from "./ListHeader";

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export default function ListItem({ data }: ListItemProps) {
  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-muted pb-2 shadow-md">
        <ListHeader list={data} />
      </div>
    </li>
  );
}
