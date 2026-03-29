"use client";

import { Label } from "@/types";

interface LabelBadgeProps {
  label: Label;
  compact?: boolean;
  onClick?: () => void;
}

export function LabelBadge({ label, compact = false, onClick }: LabelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded font-medium text-white cursor-default select-none
        ${compact ? "h-2 w-8 text-[0px]" : "px-2 py-0.5 text-xs"}
        ${onClick ? "cursor-pointer hover:brightness-90 transition-all" : ""}
      `}
      style={{ backgroundColor: label.color }}
      onClick={onClick}
      title={label.name}
    >
      {!compact && label.name}
    </span>
  );
}
