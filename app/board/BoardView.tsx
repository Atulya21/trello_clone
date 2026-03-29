"use client";

import { useState } from "react";
import { Board, Label, Card, List } from "@/types";
import { BoardCanvas } from "@/components/board/BoardCanvas";
import { useBoard } from "@/hooks/useBoard";
import { AppHeader } from "@/components/layout/AppHeader";

interface BoardViewProps {
  initialBoard: Board;
  initialLabels: Label[];
}

export function BoardView({ initialBoard, initialLabels }: BoardViewProps) {
  const {
    board,
    addList,
    updateList,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    reorderLists,
    reorderCards,
    refreshCard,
  } = useBoard();

  // Use server-fetched board as initial, then hook takes over
  const activeBoard = board ?? initialBoard;

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${activeBoard.background} 0%, ${activeBoard.background}cc 100%)`,
      }}
    >
      <AppHeader boardTitle={activeBoard.title} />
      <BoardCanvas
        board={activeBoard}
        labels={initialLabels}
        onAddList={addList}
        onUpdateList={updateList}
        onDeleteList={deleteList}
        onAddCard={addCard}
        onUpdateCard={updateCard}
        onDeleteCard={deleteCard}
        onReorderLists={reorderLists}
        onReorderCards={reorderCards}
        onRefreshCard={refreshCard}
      />
    </div>
  );
}
