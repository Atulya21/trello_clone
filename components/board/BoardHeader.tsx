"use client";

import { Board, Label, CardFilters } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { BoardFilters } from "./BoardFilters";

interface BoardHeaderProps {
  board: Board;
  filters: CardFilters;
  labels: Label[];
  onFilterChange: (f: CardFilters) => void;
}

export function BoardHeader({ board, filters, labels, onFilterChange }: BoardHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 gap-4 flex-wrap"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-white font-bold text-lg">{board.title}</h1>
        <div className="w-px h-6 bg-white/30" />
        <div className="flex -space-x-1">
          {board.members.map((m) => (
            <Avatar key={m.id} member={m} size="sm" className="ring-2 ring-white/50" />
          ))}
        </div>
      </div>

      <BoardFilters
        filters={filters}
        labels={labels}
        members={board.members}
        onChange={onFilterChange}
      />
    </div>
  );
}
