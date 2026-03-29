"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/types";
import { LabelBadge } from "@/components/ui/LabelBadge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, isOverdue, isDueSoon } from "@/lib/utils";
import {
  PencilSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

interface CardItemProps {
  card: Card;
  onOpen: (card: Card) => void;
}

export function CardItem({ card, onOpen }: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "Card", card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const totalItems = card.checklists.reduce((acc, cl) => acc + cl.items.length, 0);
  const completedItems = card.checklists.reduce(
    (acc, cl) => acc + cl.items.filter((i) => i.completed).length,
    0
  );
  const hasChecklist = totalItems > 0;
  const allDone = totalItems > 0 && completedItems === totalItems;

  const dueDateOverdue = isOverdue(card.dueDate);
  const dueDateSoon = isDueSoon(card.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative bg-white rounded-lg shadow-card hover:shadow-card-hover
        cursor-pointer transition-all duration-150 select-none
        ${isDragging ? "opacity-50 rotate-2 scale-105 shadow-xl" : ""}
      `}
      onClick={() => onOpen(card)}
    >
      {/* Edit button */}
      <button
        className="absolute top-1.5 right-1.5 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
          bg-white/80 hover:bg-[#091e420f] text-[#6b778c] z-10"
        onClick={(e) => {
          e.stopPropagation();
          onOpen(card);
        }}
      >
        <PencilSquareIcon className="w-3.5 h-3.5" />
      </button>

      <div className="p-2 pb-1.5">
        {/* Labels */}
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {card.labels.map((label) => (
              <LabelBadge key={label.id} label={label} compact />
            ))}
          </div>
        )}

        {/* Title */}
        <p className="text-sm text-[#172b4d] font-medium leading-snug pr-5">{card.title}</p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {card.dueDate && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded font-medium
                ${dueDateOverdue
                  ? "bg-[#ff5630] text-white"
                  : dueDateSoon
                  ? "bg-[#ff991f] text-white"
                  : allDone
                  ? "bg-[#36b37e] text-white"
                  : "bg-[#091e420f] text-[#6b778c]"
                }`}
            >
              <ClockIcon className="w-3 h-3" />
              {formatDate(card.dueDate)}
            </span>
          )}

          {hasChecklist && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded font-medium
                ${allDone ? "bg-[#36b37e] text-white" : "bg-[#091e420f] text-[#6b778c]"}`}
            >
              <CheckCircleIcon className="w-3 h-3" />
              {completedItems}/{totalItems}
            </span>
          )}

          {card.description && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-[#6b778c]">
              <ChatBubbleLeftIcon className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Assignees */}
        {card.assignments.length > 0 && (
          <div className="flex items-center justify-end gap-0.5 mt-1.5">
            {card.assignments.map((member) => (
              <Avatar key={member.id} member={member} size="sm" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
