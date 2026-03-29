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
      className="flex items-center justify-between px-4 py-2.5 gap-x-4 gap-y-3 flex-wrap min-h-[52px]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.16)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-white font-bold text-lg sm:text-xl tracking-tight leading-tight truncate pr-1">
          {board.title}
        </h1>
        <div className="w-px h-7 bg-white/25 shrink-0" aria-hidden />
        <div className="flex -space-x-1 shrink-0">
          {board.members.map((m) => (
            <Avatar key={m.id} member={m} size="sm" className="ring-2 ring-white/40" />
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
