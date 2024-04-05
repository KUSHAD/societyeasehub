"use client";

import { type ListWithCards } from "~/lib/types";
import ListForm from "./ListForm";
import ListItem from "./ListItem";
import {
  DragDropContext,
  Droppable,
  type OnDragEndResponder,
} from "@hello-pangea/dnd";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { reorder } from "~/lib/utils";
import { useState, useEffect } from "react";

interface ListContainerProps {
  data: ListWithCards[];
}

export default function ListContainer({ data }: ListContainerProps) {
  const { id } = useParams<{ id: string }>();

  const [orderedData, setOrderedData] = useState(data);

  const { isLoading: gettingPerms, data: canManage } =
    api.member.canManageRoadmaps.useQuery({
      societyId: id,
    });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index }),
      );

      setOrderedData(items);
    }

    // User moves a card
    if (type === "card") {
      const newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId,
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId,
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards exists on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exists on the destList
      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);

        // User moves the card to another list
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard!.listId = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard!);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="lists"
        type="list"
        direction="horizontal"
        isDropDisabled={gettingPerms || !canManage}
      >
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full gap-3"
          >
            {orderedData.map((_list, index) => (
              <ListItem key={_list.id} index={index} data={_list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="w-1 flex-shrink-0" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
