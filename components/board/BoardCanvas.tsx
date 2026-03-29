"use client";

import { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import { Board, List, Card, Label, CardFilters } from "@/types";
import { ListColumn } from "@/components/list/ListColumn";
import { CardItem } from "@/components/card/CardItem";
import { CardModal } from "@/components/card/CardModal";
import { AddListForm } from "./AddListForm";
import { BoardHeader } from "./BoardHeader";
import { PlusIcon } from "@heroicons/react/24/outline";
import { isOverdue, isDueSoon } from "@/lib/utils";
import toast from "react-hot-toast";

interface BoardCanvasProps {
  board: Board;
  labels: Label[];
  onAddList: (title: string) => Promise<void>;
  onUpdateList: (id: string, title: string) => Promise<void>;
  onDeleteList: (id: string) => Promise<void>;
  onAddCard: (listId: string, title: string) => Promise<Card | undefined>;
  onUpdateCard: (id: string, updates: Partial<Card>) => Promise<Card>;
  onDeleteCard: (id: string) => Promise<void>;
  onReorderLists: (lists: List[]) => Promise<void>;
  onReorderCards: (lists: List[]) => Promise<void>;
  onRefreshCard: (id: string) => Promise<void>;
}

const DROP_ANIMATION = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.5" } },
  }),
};

export function BoardCanvas({
  board,
  labels,
  onAddList,
  onUpdateList,
  onDeleteList,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onReorderLists,
  onReorderCards,
  onRefreshCard,
}: BoardCanvasProps) {
  const [addingList, setAddingList] = useState(false);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeDragCard, setActiveDragCard] = useState<Card | null>(null);
  const [activeDragList, setActiveDragList] = useState<List | null>(null);
  const [localLists, setLocalLists] = useState<List[]>(board.lists);
  const [filters, setFilters] = useState<CardFilters>({
    search: "",
    labelIds: [],
    dueDateFilter: null,
    memberIds: [],
  });

  // Sync localLists when board changes
  useMemo(() => { setLocalLists(board.lists); }, [board.lists]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filterCards = useCallback(
    (cards: Card[]): Card[] => {
      return cards.filter((card) => {
        if (filters.search && !card.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.labelIds.length > 0 && !filters.labelIds.some((id) => card.labels.some((l) => l.id === id))) return false;
        if (filters.memberIds.length > 0 && !filters.memberIds.some((id) => card.assignments.some((m) => m.id === id))) return false;
        if (filters.dueDateFilter === "overdue" && !isOverdue(card.dueDate)) return false;
        if (filters.dueDateFilter === "due_soon" && !isDueSoon(card.dueDate)) return false;
        if (filters.dueDateFilter === "has_date" && !card.dueDate) return false;
        return true;
      });
    },
    [filters]
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current;
    if (data?.type === "Card") setActiveDragCard(data.card);
    if (data?.type === "List") setActiveDragList(data.list);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type !== "Card") return;

    const activeCard = activeData.card as Card;
    const activeListId = activeCard.listId;

    // Determine destination list
    let overListId: string;
    if (overData?.type === "Card") {
      overListId = (overData.card as Card).listId;
    } else {
      // Dropped on a list container
      overListId = over.id as string;
    }

    if (activeListId === overListId) return;

    // Move card between lists in local state
    setLocalLists((prev) => {
      const sourceList = prev.find((l) => l.id === activeListId);
      const destList = prev.find((l) => l.id === overListId);
      if (!sourceList || !destList) return prev;

      const cardToMove = sourceList.cards.find((c) => c.id === active.id);
      if (!cardToMove) return prev;

      const overCardIndex = destList.cards.findIndex((c) => c.id === over.id);
      const insertIndex = overCardIndex >= 0 ? overCardIndex : destList.cards.length;

      return prev.map((list) => {
        if (list.id === activeListId) {
          return { ...list, cards: list.cards.filter((c) => c.id !== active.id) };
        }
        if (list.id === overListId) {
          const newCards = [...list.cards];
          newCards.splice(insertIndex, 0, { ...cardToMove, listId: overListId });
          return { ...list, cards: newCards };
        }
        return list;
      });
    });
  };

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveDragCard(null);
    setActiveDragList(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Reorder lists
    if (activeData?.type === "List" && overData?.type === "List") {
      const oldIndex = localLists.findIndex((l) => l.id === active.id);
      const newIndex = localLists.findIndex((l) => l.id === over.id);
      const reordered = arrayMove(localLists, oldIndex, newIndex);
      setLocalLists(reordered);
      try {
        await onReorderLists(reordered);
      } catch {
        toast.error("Failed to reorder lists");
        setLocalLists(board.lists);
      }
      return;
    }

    // Reorder cards within a list
    if (activeData?.type === "Card") {
      const activeCard = activeData.card as Card;

      const destListId =
        overData?.type === "Card"
          ? (overData.card as Card).listId
          : (over.id as string);

      const updatedLists = localLists.map((list) => {
        if (list.id !== destListId) return list;
        const oldIdx = list.cards.findIndex((c) => c.id === active.id);
        const newIdx = list.cards.findIndex((c) => c.id === over.id);
        if (oldIdx === -1 || newIdx === -1) return list;
        return { ...list, cards: arrayMove(list.cards, oldIdx, newIdx) };
      });

      setLocalLists(updatedLists);
      try {
        await onReorderCards(updatedLists);
      } catch {
        toast.error("Failed to reorder cards");
        setLocalLists(board.lists);
      }
    }
  };

  const handleAddCard = async (listId: string, title: string) => {
    try {
      await onAddCard(listId, title);
    } catch {
      toast.error("Failed to add card");
    }
  };

  const handleAddList = async (title: string) => {
    try {
      await onAddList(title);
      setAddingList(false);
    } catch {
      toast.error("Failed to add list");
    }
  };

  const handleOpenCard = (card: Card) => {
    // Get fresh card from localLists
    for (const list of localLists) {
      const found = list.cards.find((c) => c.id === card.id);
      if (found) { setActiveCard(found); return; }
    }
    setActiveCard(card);
  };

  // Update activeCard when board refreshes
  useMemo(() => {
    if (!activeCard) return;
    for (const list of localLists) {
      const found = list.cards.find((c) => c.id === activeCard.id);
      if (found) { setActiveCard(found); return; }
    }
  }, [localLists]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <BoardHeader
        board={board}
        filters={filters}
        labels={labels}
        onFilterChange={setFilters}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 p-4 h-full items-start">
            <SortableContext
              items={localLists.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              {localLists.map((list) => {
                const filtered = filterCards(list.cards);
                return (
                  <ListColumn
                    key={list.id}
                    list={list}
                    filteredCards={filtered}
                    onOpenCard={handleOpenCard}
                    onAddCard={handleAddCard}
                    onRenameList={onUpdateList}
                    onDeleteList={async (id) => {
                      try { await onDeleteList(id); }
                      catch { toast.error("Failed to delete list"); }
                    }}
                  />
                );
              })}
            </SortableContext>

            {/* Add list */}
            {addingList ? (
              <AddListForm
                onAdd={handleAddList}
                onCancel={() => setAddingList(false)}
              />
            ) : (
              <button
                onClick={() => setAddingList(true)}
                className="flex items-center gap-2 px-3 py-2.5 bg-white/20 hover:bg-white/30 text-white
                  rounded-xl text-sm font-medium transition-colors w-[272px] shrink-0 backdrop-blur-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add another list
              </button>
            )}
          </div>
        </div>

        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay dropAnimation={DROP_ANIMATION}>
              {activeDragCard && (
                <div className="rotate-3 scale-105 shadow-xl">
                  <CardItem card={activeDragCard} onOpen={() => {}} />
                </div>
              )}
              {activeDragList && (
                <div className="opacity-90 rotate-1 scale-105">
                  <div className="w-[272px] bg-[#f1f2f4] rounded-xl shadow-xl p-3">
                    <p className="text-sm font-semibold text-[#172b4d]">{activeDragList.title}</p>
                  </div>
                </div>
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>

      {activeCard && (
        <CardModal
          card={activeCard}
          boardLabels={labels}
          boardMembers={board.members}
          onClose={() => setActiveCard(null)}
          onUpdate={onUpdateCard}
          onDelete={onDeleteCard}
          onRefresh={onRefreshCard}
        />
      )}
    </div>
  );
}
