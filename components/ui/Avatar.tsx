"use client";

import { Member } from "@/types";

interface AvatarProps {
  member: Member;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export function Avatar({ member, size = "md", className = "" }: AvatarProps) {
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${className}`}
      style={{ backgroundColor: member.avatarColor }}
      title={member.name}
    >
      {member.initials}
    </div>
  );
}
