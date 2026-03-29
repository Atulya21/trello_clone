"use client";

import { useState } from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { List, Card } from "@/types";
import { CardItem } from "@/components/card/CardItem";
import { ListHeader } from "./ListHeader";
import { AddCardForm } from "./AddCardForm";
import { PlusIcon } from "@heroicons/react/24/outline";

interface ListColumnProps {
  list: List;
  filteredCards: Card[];
  onOpenCard: (card: Card) => void;
  onAddCard: (listId: string, title: string) => Promise<void>;
  onRenameList: (listId: string, title: string) => Promise<void>;
  onDeleteList: (listId: string) => Promise<void>;
}

export function ListColumn({
  list,
  filteredCards,
  onOpenCard,
  onAddCard,
  onRenameList,
  onDeleteList,
}: ListColumnProps) {
  const [addingCard, setAddingCard] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id, data: { type: "List", list } });

  const { setNodeRef: setDropRef } = useDroppable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddCard = async (title: string) => {
    await onAddCard(list.id, title);
    setAddingCard(false);
  };

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={`flex flex-col w-[272px] shrink-0 rounded-xl bg-[#ebecf0] shadow-list
        transition-shadow duration-200 ease-out
        ${isDragging ? "opacity-50 rotate-1 scale-105 shadow-lg" : ""}
      `}
    >
      {/* Drag handle on header */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <ListHeader
          title={list.title}
          cardCount={filteredCards.length}
          onRename={(title) => onRenameList(list.id, title)}
          onDelete={() => onDeleteList(list.id)}
        />
      </div>

      {/* Cards */}
      <div
        ref={setDropRef}
        className="flex-1 px-2 pb-2 space-y-2 min-h-[4px] overflow-y-auto max-h-[calc(100vh-220px)] [scrollbar-gutter:stable]"
      >
        <SortableContext
          items={filteredCards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredCards.map((card) => (
            <CardItem key={card.id} card={card} onOpen={onOpenCard} />
          ))}
        </SortableContext>
      </div>

      {/* Add card */}
      <div className="px-2 pb-2">
        {addingCard ? (
          <AddCardForm onAdd={handleAddCard} onCancel={() => setAddingCard(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setAddingCard(true)}
            className="w-full flex items-center gap-1.5 px-2 py-2 rounded-lg text-sm font-medium text-[#44546f]
              hover:bg-[#091e4221] transition-colors duration-200 ease-out text-left"
          >
            <PlusIcon className="w-4 h-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}
