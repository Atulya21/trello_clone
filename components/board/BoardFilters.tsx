"use client";

import { Label, Member, CardFilters } from "@/types";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@/components/ui/Avatar";

interface BoardFiltersProps {
  filters: CardFilters;
  labels: Label[];
  members: Member[];
  onChange: (filters: CardFilters) => void;
}

export function BoardFilters({ filters, labels, members, onChange }: BoardFiltersProps) {
  const set = (partial: Partial<CardFilters>) => onChange({ ...filters, ...partial });

  const toggleLabel = (id: string) => {
    const ids = filters.labelIds.includes(id)
      ? filters.labelIds.filter((l) => l !== id)
      : [...filters.labelIds, id];
    set({ labelIds: ids });
  };

  const toggleMember = (id: string) => {
    const ids = filters.memberIds.includes(id)
      ? filters.memberIds.filter((m) => m !== id)
      : [...filters.memberIds, id];
    set({ memberIds: ids });
  };

  const toggleDue = (val: CardFilters["dueDateFilter"]) => {
    set({ dueDateFilter: filters.dueDateFilter === val ? null : val });
  };

  const hasFilters =
    filters.search ||
    filters.labelIds.length > 0 ||
    filters.dueDateFilter ||
    filters.memberIds.length > 0;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b778c]" />
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search cards…"
          className="pl-8 pr-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 focus:bg-white border border-white/30 focus:border-[#4c9aff]
            rounded-lg text-white placeholder:text-white/70 focus:text-[#172b4d] focus:placeholder:text-[#8590a2]
            transition-all w-44 focus:w-56 focus:outline-none"
        />
      </div>

      {/* Members */}
      <div className="flex items-center gap-1">
        {members.map((m) => (
          <button
            key={m.id}
            onClick={() => toggleMember(m.id)}
            title={m.name}
            className={`rounded-full transition-all ${
              filters.memberIds.includes(m.id)
                ? "ring-2 ring-white ring-offset-1 ring-offset-transparent scale-110"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Avatar member={m} size="sm" />
          </button>
        ))}
      </div>

      {/* Label filters */}
      <div className="flex items-center gap-1">
        {labels.slice(0, 4).map((l) => (
          <button
            key={l.id}
            onClick={() => toggleLabel(l.id)}
            title={l.name}
            className={`h-6 px-2 rounded text-[11px] font-semibold text-white transition-all
              ${filters.labelIds.includes(l.id)
                ? "ring-2 ring-white ring-offset-1 scale-110"
                : "opacity-70 hover:opacity-100"
              }`}
            style={{ backgroundColor: l.color }}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Due date filters */}
      <div className="flex items-center gap-1">
        {(["overdue", "due_soon", "has_date"] as const).map((val) => {
          const labels_map = { overdue: "Overdue", due_soon: "Due Soon", has_date: "Has Date" };
          const active = filters.dueDateFilter === val;
          return (
            <button
              key={val}
              onClick={() => toggleDue(val)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all
                ${active
                  ? "bg-white text-[#172b4d]"
                  : "bg-white/20 text-white hover:bg-white/30"
                }`}
            >
              {labels_map[val]}
            </button>
          );
        })}
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => onChange({ search: "", labelIds: [], dueDateFilter: null, memberIds: [] })}
          className="flex items-center gap-1 text-white/80 hover:text-white text-xs transition-colors"
        >
          <XMarkIcon className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
